"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Hash } from "lucide-react";
import { SidebarTrigger } from "@/src/components/shadcn/sidebar";
import { Skeleton } from "@/src/components/shadcn/skeleton";
import { Button } from "@/src/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/components/shadcn/sheet";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useChatUnread, useMarkChannelRead, hasAnyUnread } from "@/src/hooks/use-chat-unread";
import { useChatMessages, useChatRealtime } from "@/src/hooks/chat";
import { useChatChannels } from "@/src/lib/api/chat/channels/hooks";
import { getProjectsByWorkspaceSlug } from "@/src/lib/api/project/services";
import type { sidebarProjectType } from "@/src/types/project";
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
  const subParam = searchParams.get("sub");
  // Resolved as soon as the page mounts (searchParams is sync) — null means
  // General, a number means that project's channel.
  const projectId = channelParam ? Number(channelParam) : null;
  // null means that project's own main channel (or General, which never has
  // a sub-channel); a number means a named sub-channel within the project.
  const channelId = subParam ? Number(subParam) : null;

  // Below md, the channel rail moves into a slide-out sheet instead of a
  // permanent column (it was eating ~60% of a phone's width otherwise).
  const [isRailOpen, setIsRailOpen] = useState(false);

  // Same queryKey the rail itself uses, so this just reads the shared
  // react-query cache instead of firing a second request — only needed here
  // to label the mobile "switch channel" trigger with the current channel.
  const { data: projectsData } = useQuery({
    queryKey: ["projects", workspaceSlug],
    queryFn: () => getProjectsByWorkspaceSlug(workspaceSlug!),
    enabled: Boolean(workspaceSlug),
  });
  // Only fetched when a sub-channel is actually active — resolves its name
  // for the header/mobile-trigger label. The rail fetches its own copy
  // (lazily, per expanded project) independently of this.
  const { data: activeProjectChannels } = useChatChannels(projectId, channelId !== null);

  const activeChannelLabel =
    projectId === null
      ? "General"
      : channelId !== null
        ? (activeProjectChannels?.find((c) => c.id === channelId)?.name ?? "Channel")
        : ((projectsData?.projects as sidebarProjectType[] | undefined)?.find(
            (p) => p.id === projectId,
          )?.name ?? "Channel");

  const setChannel = useCallback(
    (nextProjectId: number | null, nextChannelId: number | null = null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextProjectId === null) {
        params.delete("channel");
      } else {
        params.set("channel", String(nextProjectId));
      }
      if (nextChannelId === null) {
        params.delete("sub");
      } else {
        params.set("sub", String(nextChannelId));
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
  } = useChatMessages(workspaceId, projectId, channelId);

  useChatRealtime(workspaceId, projectId, channelId);

  const messages = useMemo(
    () => data?.pages.flatMap((page) => page.messages) ?? [],
    [data],
  );

  // Advance this channel's read cursor whenever it's the one on-screen and
  // its latest real (non-optimistic) message changes — covers both "just
  // opened this channel" and "a new message streamed in while I'm already
  // looking at it." lastRealMessage stays undefined while the only entry
  // is still a pending optimistic echo (negative temp id), so we don't
  // mark-read against an id the server doesn't know yet.
  const { data: unreadChannels } = useChatUnread(workspaceId);
  const anyChannelUnread = hasAnyUnread(unreadChannels);
  const markChannelRead = useMarkChannelRead(workspaceId);
  const lastRealMessageId = [...messages].reverse().find((m) => !m.pending && m.id > 0)?.id;

  useEffect(() => {
    if (!workspaceId || lastRealMessageId === undefined) return;
    markChannelRead.mutate({
      projectId: projectId ?? undefined,
      channelId: channelId ?? undefined,
      lastMessageId: lastRealMessageId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, projectId, channelId, lastRealMessageId]);

  return (
    <div className="flex h-svh flex-col">
      <div className="flex items-center gap-2 border-b p-4 sm:gap-3">
        <SidebarTrigger />
        <h1 className="min-w-0 flex-1 truncate text-h1 font-medium">
          {workspaceName ?? "Workspace"} chat
        </h1>
        <Button
          variant="outline"
          size="sm"
          className="relative shrink-0 md:hidden"
          onClick={() => setIsRailOpen(true)}
        >
          <Hash className="size-3.5" />
          <span className="max-w-24 truncate">{activeChannelLabel}</span>
          {anyChannelUnread && (
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ChatChannelRail
          workspaceId={workspaceId}
          workspaceSlug={workspaceSlug}
          activeProjectId={projectId}
          activeChannelId={channelId}
          onSelect={setChannel}
          className="hidden md:flex"
        />

        <Sheet open={isRailOpen} onOpenChange={setIsRailOpen}>
          <SheetContent side="left" className="w-72 gap-0 p-0 sm:max-w-72">
            <SheetHeader className="border-b p-3">
              <SheetTitle>Channels</SheetTitle>
            </SheetHeader>
            <ChatChannelRail
              workspaceId={workspaceId}
              workspaceSlug={workspaceSlug}
              activeProjectId={projectId}
              activeChannelId={channelId}
              onSelect={(nextProjectId, nextChannelId) => {
                setChannel(nextProjectId, nextChannelId);
                setIsRailOpen(false);
              }}
              className="w-full border-r-0"
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
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
              workspaceId={workspaceId}
              projectId={projectId}
              channelId={channelId}
            />
          )}

          <ChatComposer workspaceId={workspaceId} projectId={projectId} channelId={channelId} />
        </div>
      </div>
    </div>
  );
}
