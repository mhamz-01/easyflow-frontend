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
import { useChatUnreadStore, hasWorkspaceUnread } from "@/src/store/chatUnread";
import { useChatMessages, useChatRealtime } from "@/src/hooks/chat";
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
  // Resolved as soon as the page mounts (searchParams is sync) — null means
  // General, a number means that project's channel.
  const projectId = channelParam ? Number(channelParam) : null;

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
  const activeChannelLabel =
    projectId === null
      ? "General"
      : ((projectsData?.projects as sidebarProjectType[] | undefined)?.find(
          (p) => p.id === projectId,
        )?.name ?? "Channel");

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

  const setActiveChannel = useChatUnreadStore((s) => s.setActiveChannel);
  const clearActiveChannel = useChatUnreadStore((s) => s.clearActiveChannel);
  useEffect(() => {
    if (!workspaceId) return;
    setActiveChannel(workspaceId, projectId);
    return () => clearActiveChannel();
  }, [workspaceId, projectId, setActiveChannel, clearActiveChannel]);

  const anyChannelUnread = useChatUnreadStore((s) =>
    workspaceId ? hasWorkspaceUnread(s.unread, workspaceId) : false,
  );

  const messages = useMemo(
    () => data?.pages.flatMap((page) => page.messages) ?? [],
    [data],
  );

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
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary-blue" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ChatChannelRail
          workspaceId={workspaceId}
          workspaceSlug={workspaceSlug}
          activeProjectId={projectId}
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
              onSelect={(nextProjectId) => {
                setChannel(nextProjectId);
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
            />
          )}

          <ChatComposer workspaceId={workspaceId} projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
