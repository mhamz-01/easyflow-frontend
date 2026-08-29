import { useEffect } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/src/lib/api/notifications/services";
import { subscribeToNotificationTopic } from "@/src/lib/realtime/notificationChannelRegistry";
import { useCurrentUser } from "./use-current-user";
import type { AppNotification, NotificationsPage } from "@/src/types/notifications";

type NotificationCache = { pages: NotificationsPage[]; pageParams: unknown[] };

// Source of truth is the notifications table, polled — same reasoning as
// useChatUnread: a realtime broadcast can be missed (offline, dropped
// connection, a channel silently torn down by another subscriber), so
// polling is what keeps the badge eventually correct regardless of what the
// realtime pipe did or didn't deliver. useNotificationsRealtime below is
// purely an accelerant on top of this — instant when it works, harmless
// (just a slightly stale badge for up to one interval) when it doesn't.
const UNREAD_POLL_INTERVAL_MS = 20_000;

export const notificationKeys = {
  unread: (workspaceId: number) => ["notifications", "unread", workspaceId] as const,
  list: (workspaceId: number) => ["notifications", "list", workspaceId] as const,
};

// ─── Unread count (bell badge) ─────────────────────────────────────────────

export const useNotificationsUnread = (workspaceId: number | null | undefined) => {
  return useQuery({
    queryKey: notificationKeys.unread(workspaceId as number),
    queryFn: () => notificationService.getUnreadCount(),
    enabled: !!workspaceId,
    refetchInterval: UNREAD_POLL_INTERVAL_MS,
    placeholderData: (prev) => prev,
  });
};

// ─── History (cursor-paginated, for the dropdown panel) ───────────────────

export const useNotificationsList = (workspaceId: number | null | undefined) => {
  return useInfiniteQuery({
    queryKey: notificationKeys.list(workspaceId as number),
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      notificationService.getNotifications({ cursor: pageParam, limit: 20 }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: NotificationsPage) =>
      lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    enabled: !!workspaceId,
  });
};

// ─── Mark read ──────────────────────────────────────────────────────────────

export const useMarkNotificationRead = (workspaceId: number | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationService.markRead(id),

    // Optimistic: clear the badge/row instantly rather than waiting on the
    // next poll — same pattern as useMarkChannelRead.
    onMutate: async (id: number) => {
      if (!workspaceId) return;

      const unreadKey = notificationKeys.unread(workspaceId);
      const listKey = notificationKeys.list(workspaceId);
      const previousUnread = queryClient.getQueryData<number>(unreadKey);
      const previousList = queryClient.getQueryData<NotificationCache>(listKey);

      let wasUnread = false;
      queryClient.setQueryData<NotificationCache>(listKey, (data) => {
        if (!data) return data;
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((n) => {
              if (n.id !== id || n.isRead) return n;
              wasUnread = true;
              return { ...n, isRead: true };
            }),
          })),
        };
      });

      if (wasUnread) {
        queryClient.setQueryData<number>(unreadKey, (count) => Math.max(0, (count ?? 1) - 1));
      }

      return { previousUnread, previousList, unreadKey, listKey };
    },

    onError: (_err, _id, context) => {
      if (!context) return;
      queryClient.setQueryData(context.unreadKey, context.previousUnread);
      queryClient.setQueryData(context.listKey, context.previousList);
    },
  });
};

export const useMarkAllNotificationsRead = (workspaceId: number | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllRead(),

    onMutate: async () => {
      if (!workspaceId) return;

      const unreadKey = notificationKeys.unread(workspaceId);
      const listKey = notificationKeys.list(workspaceId);
      const previousUnread = queryClient.getQueryData<number>(unreadKey);
      const previousList = queryClient.getQueryData<NotificationCache>(listKey);

      queryClient.setQueryData<number>(unreadKey, 0);
      queryClient.setQueryData<NotificationCache>(listKey, (data) => {
        if (!data) return data;
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((n) => ({ ...n, isRead: true })),
          })),
        };
      });

      return { previousUnread, previousList, unreadKey, listKey };
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      queryClient.setQueryData(context.unreadKey, context.previousUnread);
      queryClient.setQueryData(context.listKey, context.previousList);
    },
  });
};

// ─── Live delivery ──────────────────────────────────────────────────────────
// Subscribes to this user's private notification topic for the current
// workspace and keeps the unread-count + list caches in sync the instant a
// broadcast arrives. `onNotification` is an optional side-effect hook (the
// toast popup) — kept out of this hook so cache-sync behavior doesn't
// depend on any particular UI being mounted; multiple components can mount
// this (e.g. a global toast listener + the bell panel) and share one
// underlying channel via notificationChannelRegistry's ref-counting.
export const useNotificationsRealtime = (
  workspaceId: number | null | undefined,
  onNotification?: (notification: AppNotification) => void,
) => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (!workspaceId || !currentUser?.id) return;

    const topic = `workspace-notifications:${workspaceId}:${currentUser.id}`;

    const unsubscribe = subscribeToNotificationTopic(
      topic,
      "notification_created",
      (payload) => {
        const notification = payload as AppNotification;
        const unreadKey = notificationKeys.unread(workspaceId);
        const listKey = notificationKeys.list(workspaceId);

        queryClient.setQueryData<number>(unreadKey, (count) => (count ?? 0) + 1);

        queryClient.setQueryData<NotificationCache>(listKey, (data) => {
          if (!data) return data;
          const alreadyPresent = data.pages.some((page) =>
            page.notifications.some((n) => n.id === notification.id),
          );
          if (alreadyPresent) return data;

          const pages = [...data.pages];
          pages[0] = { ...pages[0], notifications: [notification, ...pages[0].notifications] };
          return { ...data, pages };
        });

        onNotification?.(notification);
      },
      (status) => {
        if (status === "CHANNEL_ERROR") {
          // Connection dropped — refetch to catch up on anything missed.
          queryClient.invalidateQueries({ queryKey: notificationKeys.unread(workspaceId) });
        }
      },
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, currentUser?.id, queryClient]);
};
