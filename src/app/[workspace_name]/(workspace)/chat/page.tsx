"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "@/src/components/shadcn/sidebar";
import { Skeleton } from "@/src/components/shadcn/skeleton";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useChatMessages, useChatRealtime } from "@/src/hooks/chat";
import ChatChannelRail from "./_components/channel-rail";
import ChatMessageList from "./_components/message-list";
import ChatComposer from "./_components/composer";

export default function ChatPage() {
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const workspaceName = useWorkspaceStore((s) => s.workspace?.workspaceName);
  const workspaceSlug = useWorkspaceStore((s) => s.workspace?.workspaceSlug);
  const { user } = useUser();
  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

  const router = useRouter();
  const searchParams = useSearchParams();
  const channelParam = searchParams.get("channel");
  // Resolved as soon as the page mounts (searchParams is sync) — null means
  // General, a number means that project's channel.
  const projectId = channelParam ? Number(channelParam) : null;

  const setChannel = useCallback(
    (nextProjectId: number | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextProjectId === null) {
        params.delete("channel");
      } else {
        params.set("channel", String(nextProjectId));
      }
      const query = params.toString();
      router.replace(query ? `?${query}` : "?", { scroll: false });
    },
    [router, searchParams],
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(workspaceId, projectId);

  useChatRealtime(workspaceId, projectId);

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

      <div className="flex flex-1 overflow-hidden">
        <ChatChannelRail
          workspaceSlug={workspaceSlug}
          activeProjectId={projectId}
          onSelect={setChannel}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
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

          <ChatComposer workspaceId={workspaceId} projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
