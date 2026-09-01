"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/src/lib/api/chat/services";
import type { ChatUnreadChannel } from "@/src/types/chat";

// Source of truth is the chatReadStates table (see CHAT_IMPLEMENTATION.md)
// — this is polling, not a realtime subscription, on purpose. An earlier
// version tracked unread state purely client-side off realtime broadcasts
// and had no way to recover if a broadcast was ever missed (offline,
// dropped connection, or — as actually happened — two hooks silently
// tearing down each other's shared Supabase channel object). Polling a
// DB-backed summary is a little less instant, but it's always eventually
// correct regardless of what the realtime pipe did or didn't deliver.
// Live message delivery inside an already-open channel is unaffected —
// that's still instant via useChatRealtime.
const UNREAD_POLL_INTERVAL_MS = 20_000;

export const unreadKeys = {
  summary: (workspaceId: number) => ["chat", "unread", workspaceId] as const,
};

export const useChatUnread = (workspaceId: number | null | undefined) => {
  return useQuery({
    queryKey: unreadKeys.summary(workspaceId as number),
    queryFn: () => chatService.getUnread(),
    enabled: !!workspaceId,
    refetchInterval: UNREAD_POLL_INTERVAL_MS,
    // Keep showing the last known summary while a background refetch is in
    // flight, instead of flashing badges away and back every 20s.
    placeholderData: (prev) => prev,
  });
};

export const isChannelUnread = (
  channels: ChatUnreadChannel[] | undefined,
  projectId: number | null,
  channelId: number | null = null,
) =>
  !!channels?.find((c) => c.projectId === projectId && c.channelId === channelId)?.unread;

export const hasAnyUnread = (channels: ChatUnreadChannel[] | undefined) =>
  !!channels?.some((c) => c.unread);

// Called from the chat page whenever a channel becomes active and whenever
// its latest message id changes while it stays active (see page.tsx) — the
// server-side cursor only ever moves forward, so redundant/late calls are
// harmless no-ops.
export const useMarkChannelRead = (workspaceId: number | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { projectId?: number; channelId?: number; lastMessageId?: number }) =>
      chatService.markRead(payload),

    // Optimistic: clear this channel's badge the instant we ask the server
    // to mark it read, rather than waiting for the next 20s poll.
    onMutate: (payload) => {
      if (!workspaceId) return;
      const projectId = payload.projectId ?? null;
      const channelId = payload.channelId ?? null;
      const key = unreadKeys.summary(workspaceId);

      queryClient.setQueryData<ChatUnreadChannel[]>(key, (data) =>
        data?.map((c) =>
          c.projectId === projectId && c.channelId === channelId ? { ...c, unread: false } : c,
        ),
      );
    },
  });
};
