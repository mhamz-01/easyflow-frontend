import { useEffect, useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { chatService } from "../lib/api/chat/services";
import { getSupabaseClient } from "../lib/realtime/supabaseClient";
import type { ChatMessage, ChatMessagesPage } from "@/src/types/chat";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const chatKeys = {
  messages: (workspaceId: number) => ["chat", "messages", workspaceId] as const,
};

// ─── History (cursor-paginated, oldest page loaded on scroll-up) ──────────────

export const useChatMessages = (workspaceId: number | null | undefined) => {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(workspaceId as number),
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      chatService.getMessages({ cursor: pageParam, limit: 30 }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: ChatMessagesPage) =>
      lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    enabled: !!workspaceId,
  });
};

// ─── Send ───────────────────────────────────────────────────────────────────────
// No optimistic cache append here on purpose: the message the sender just
// posted comes back through the same realtime channel every other member
// gets it through (useChatRealtime below), so there's one single code path
// that ever writes a message into the cache.

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (content: string) => chatService.sendMessage(content),
    onError: () => {
      toast.error("Message failed to send. Please try again.");
    },
  });
};

// ─── Live updates ─────────────────────────────────────────────────────────────

export const useChatRealtime = (workspaceId: number | null | undefined) => {
  const queryClient = useQueryClient();
  const seenIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!workspaceId) return;

    seenIds.current = new Set();
    const supabase = getSupabaseClient();
    const channel = supabase.channel(`workspace-chat:${workspaceId}`, {
      config: { private: true },
    });

    channel
      .on("broadcast", { event: "chat_message" }, ({ payload }) => {
        const message = payload as ChatMessage;

        // Guards against duplicate delivery on reconnect.
        if (seenIds.current.has(message.id)) return;
        seenIds.current.add(message.id);

        queryClient.setQueryData<{ pages: ChatMessagesPage[]; pageParams: unknown[] }>(
          chatKeys.messages(workspaceId),
          (data) => {
            if (!data) return data;
            const pages = [...data.pages];
            const lastPage = pages[pages.length - 1];
            pages[pages.length - 1] = {
              ...lastPage,
              messages: [...lastPage.messages, message],
            };
            return { ...data, pages };
          },
        );
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          // Connection dropped — refetch to catch up on anything missed.
          queryClient.invalidateQueries({ queryKey: chatKeys.messages(workspaceId) });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, queryClient]);
};
