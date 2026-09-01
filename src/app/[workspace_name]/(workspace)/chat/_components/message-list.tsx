"use client";

import { useLayoutEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/shadcn/button";
import ChatMessageItem from "./message-item";
import ChatEmptyState from "./empty-state";
import type { ChatMessage } from "@/src/types/chat";

// Plain scrollable list, not virtualized — a single workspace's chat history
// is nowhere near the volume where that would matter, and reverse-infinite
// scroll + virtualization is a lot of extra failure surface for no visible
// gain at this scale. Revisit only if message counts grow large.
const NEAR_BOTTOM_THRESHOLD = 120;

const ChatMessageList = ({
  messages,
  currentUserEmail,
  hasMore,
  isFetchingMore,
  onLoadMore,
  workspaceId,
  projectId,
  channelId = null,
}: {
  messages: ChatMessage[];
  currentUserEmail: string | undefined;
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  workspaceId: number | null | undefined;
  projectId: number | null;
  channelId?: number | null;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wasNearBottom = useRef(true);
  const isLoadingOlderRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const messageCount = messages.length;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isLoadingOlderRef.current) {
      // Older messages were just prepended — keep the reader's position
      // anchored to the same message instead of jumping the viewport.
      el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
      isLoadingOlderRef.current = false;
      return;
    }

    if (wasNearBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messageCount]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    wasNearBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_THRESHOLD;
  };

  const handleLoadMore = () => {
    const el = containerRef.current;
    if (el) prevScrollHeightRef.current = el.scrollHeight;
    isLoadingOlderRef.current = true;
    onLoadMore();
  };

  if (messageCount === 0) {
    return <ChatEmptyState />;
  }

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4">
      {hasMore && (
        <div className="flex justify-center py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Load older messages"
            )}
          </Button>
        </div>
      )}

      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          isOwn={message.author.email === currentUserEmail}
          workspaceId={workspaceId}
          projectId={projectId}
          channelId={channelId}
        />
      ))}
    </div>
  );
};

export default ChatMessageList;
