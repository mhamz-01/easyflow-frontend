import { useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { chatService } from "../lib/api/chat/services";
import { getSupabaseClient } from "../lib/realtime/supabaseClient";
import type { ChatAttachment, ChatMessage, ChatMessagesPage } from "@/src/types/chat";

type ChatCache = { pages: ChatMessagesPage[]; pageParams: unknown[] };

// Monotonic counter appended to Date.now() so two sends in the same
// millisecond (e.g. rapid double-click) never collide on tempId.
let tempIdSeq = 0;
const nextTempId = () => -(Date.now() * 1000 + (tempIdSeq++ % 1000));

// Identifies "the same message" across the optimistic echo and its real
// counterpart (whichever arrives first — mutation onSuccess or realtime
// broadcast). Content can be null (bare-attachment message), so it's folded
// into the key alongside the attachment identity rather than relied on alone.
const reconcileKey = (m: Pick<ChatMessage, "content" | "attachment"> & {
  author: Pick<ChatMessage["author"], "email">;
}) =>
  `${m.author.email}|${m.content ?? ""}|${
    m.attachment ? `${m.attachment.type}:${m.attachment.id}` : ""
  }`;

// ─── Query Keys ───────────────────────────────────────────────────────────────
// null projectId = General, a project id = that project's channel — each
// channel gets its own cache entry so switching channels never mixes history.

export const chatKeys = {
  messages: (workspaceId: number, projectId: number | null) =>
    ["chat", "messages", workspaceId, projectId ?? "general"] as const,
};

// ─── History (cursor-paginated, oldest page loaded on scroll-up) ──────────────

export const useChatMessages = (
  workspaceId: number | null | undefined,
  projectId: number | null | undefined,
) => {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(workspaceId as number, projectId ?? null),
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      chatService.getMessages({
        projectId: projectId ?? undefined,
        cursor: pageParam,
        limit: 30,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: ChatMessagesPage) =>
      lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    // projectId undefined means "channel not resolved yet" (gate the query);
    // null is a resolved value (General) and must NOT gate it.
    enabled: !!workspaceId && projectId !== undefined,
  });
};

// ─── Send ───────────────────────────────────────────────────────────────────────
// Optimistic: a local echo of the message is appended to the cache the instant
// `mutate` is called, so the sender sees it immediately. It's tagged `pending`
// until reconciled with the "real" message, which can arrive via either path
// (whichever wins the race):
//   - the mutation's own HTTP response (onSuccess), or
//   - the realtime broadcast every other member also receives (useChatRealtime)
// Both paths are idempotent against each other — see the dedupe/reconcile logic
// in useChatRealtime, which is the single place cache writes are merged.

export const useSendMessage = (
  workspaceId: number | null | undefined,
  projectId: number | null | undefined,
) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (payload: { content?: string; attachment?: ChatAttachment }) =>
      chatService.sendMessage({ ...payload, projectId: projectId ?? undefined }),

    onMutate: async (payload: { content?: string; attachment?: ChatAttachment }) => {
      if (!workspaceId || projectId === undefined) return undefined;

      const key = chatKeys.messages(workspaceId, projectId);
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<ChatCache>(key);
      const tempId = nextTempId();

      const optimisticMessage: ChatMessage = {
        id: tempId,
        workspaceId,
        projectId,
        userId: -1,
        content: payload.content ?? null,
        attachment: payload.attachment ?? null,
        editedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: -1,
          username: user?.username ?? user?.fullName ?? "You",
          email: user?.primaryEmailAddress?.emailAddress ?? "",
          imageUrl: user?.imageUrl ?? null,
        },
        pending: true,
      };

      queryClient.setQueryData<ChatCache>(key, (data) => {
        if (!data) return data;
        const pages = [...data.pages];
        const lastPage = pages[pages.length - 1];
        pages[pages.length - 1] = {
          ...lastPage,
          messages: [...lastPage.messages, optimisticMessage],
        };
        return { ...data, pages };
      });

      return { previous, tempId, key };
    },

    onError: (_err, _payload, context) => {
      if (context?.key) {
        queryClient.setQueryData(context.key, context.previous);
      }
      toast.error("Message failed to send. Please try again.");
    },

    onSuccess: (message, _payload, context) => {
      if (!context) return;

      queryClient.setQueryData<ChatCache>(context.key, (data) => {
        if (!data) return data;

        let found = false;
        const pages = data.pages.map((page) => {
          const messages = page.messages.map((m) => {
            if (m.id !== context.tempId) return m;
            found = true;
            return message;
          });
          return found ? { ...page, messages } : page;
        });

        // Already reconciled by the realtime broadcast beating the HTTP
        // response back — nothing left to replace.
        if (!found) return data;
        return { ...data, pages };
      });
    },
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────
// Optimistic: the message disappears from the cache immediately; restored on
// error. Other tabs/members learn about the deletion via the realtime
// "chat_message_deleted" broadcast handled in useChatRealtime below — this
// mutation only needs to update the deleter's own cache.

export const useDeleteMessage = (
  workspaceId: number | null | undefined,
  projectId: number | null | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) => chatService.deleteMessage(messageId),

    onMutate: async (messageId: number) => {
      if (!workspaceId || projectId === undefined) return undefined;

      const key = chatKeys.messages(workspaceId, projectId);
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<ChatCache>(key);

      queryClient.setQueryData<ChatCache>(key, (data) => {
        if (!data) return data;
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            messages: page.messages.filter((m) => m.id !== messageId),
          })),
        };
      });

      return { previous, key };
    },

    onError: (_err, _messageId, context) => {
      if (context?.key) {
        queryClient.setQueryData(context.key, context.previous);
      }
      toast.error("Couldn't delete message. Please try again.");
    },
  });
};

// ─── Live updates ─────────────────────────────────────────────────────────────

export const useChatRealtime = (
  workspaceId: number | null | undefined,
  projectId: number | null | undefined,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId || projectId === undefined) return;

    const supabase = getSupabaseClient();
    const topic = `workspace-chat:${workspaceId}:${projectId ?? "general"}`;
    const channel = supabase.channel(topic, {
      config: { private: true },
    });

    channel
      .on("broadcast", { event: "chat_message" }, ({ payload }) => {
        const message = payload as ChatMessage;
        const key = chatKeys.messages(workspaceId, projectId);

        queryClient.setQueryData<ChatCache>(key, (data) => {
          if (!data) return data;

          // Already present — either a reconnect redelivery, or the sender's
          // own mutation already reconciled it via onSuccess. Skip.
          const alreadyPresent = data.pages.some((page) =>
            page.messages.some((m) => m.id === message.id),
          );
          if (alreadyPresent) return data;

          // If this is the sender's own message, it may still be sitting in
          // the cache as a pending optimistic entry — replace that instead
          // of appending a duplicate.
          let reconciled = false;
          const pages = data.pages.map((page) => {
            if (reconciled) return page;
            let foundInPage = false;
            const messages = page.messages.map((m) => {
              if (foundInPage || !m.pending || reconcileKey(m) !== reconcileKey(message)) {
                return m;
              }
              foundInPage = true;
              reconciled = true;
              return message;
            });
            return foundInPage ? { ...page, messages } : page;
          });

          if (reconciled) return { ...data, pages };

          const newPages = [...data.pages];
          const lastPage = newPages[newPages.length - 1];
          newPages[newPages.length - 1] = {
            ...lastPage,
            messages: [...lastPage.messages, message],
          };
          return { ...data, pages: newPages };
        });
      })
      .on("broadcast", { event: "chat_message_deleted" }, ({ payload }) => {
        const { id } = payload as { id: number };
        const key = chatKeys.messages(workspaceId, projectId);

        queryClient.setQueryData<ChatCache>(key, (data) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((m) => m.id !== id),
            })),
          };
        });
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          // Connection dropped — refetch to catch up on anything missed.
          queryClient.invalidateQueries({
            queryKey: chatKeys.messages(workspaceId, projectId),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, projectId, queryClient]);
};
