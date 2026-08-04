"use client";

import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "@/src/components/shadcn/sidebar";
import { Skeleton } from "@/src/components/shadcn/skeleton";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useChatMessages, useChatRealtime } from "@/src/hooks/chat";
import ChatMessageList from "./_components/message-list";
import ChatComposer from "./_components/composer";

export default function ChatPage() {
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const workspaceName = useWorkspaceStore((s) => s.workspace?.workspaceName);
  const { user } = useUser();
  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(workspaceId);

  useChatRealtime(workspaceId);

  const messages = useMemo(
    () => data?.pages.flatMap((page) => page.messages) ?? [],
    [data],
  );

  return (
    <div className="flex h-svh flex-col">
      <div className="flex items-center gap-3 border-b p-4">
        <SidebarTrigger />
        <h1 className="text-h1 font-medium">{workspaceName ?? "Workspace"} chat</h1>
      </div>

      {isLoading ? (
        <div className="flex-1 space-y-4 p-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-12 w-1/2 ml-auto" />
          <Skeleton className="h-12 w-2/3" />
        </div>
      ) : isError ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Couldn&apos;t load chat history. Try refreshing the page.
        </div>
      ) : (
        <ChatMessageList
          messages={messages}
          currentUserEmail={currentUserEmail}
          hasMore={!!hasNextPage}
          isFetchingMore={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      )}

      <ChatComposer />
    </div>
  );
}
