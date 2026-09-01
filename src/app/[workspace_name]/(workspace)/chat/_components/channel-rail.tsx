"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Hash, Loader2, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/src/lib/utils";
import { getProjectsByWorkspaceSlug } from "@/src/lib/api/project/services";
import { useChatUnread, isChannelUnread } from "@/src/hooks/use-chat-unread";
import { useCurrentWorkspaceRole } from "@/src/lib/api/workspace/members/hooks";
import { useChatChannels, useDeleteChatChannel } from "@/src/lib/api/chat/channels/hooks";
import { AlertDialog } from "@/src/components/shadcn/alert-dialog";
import AlertDialogContentModal from "@/src/components/modals/alert-dialog-content";
import CreateChannelModal from "@/src/components/modals/create-channel-modal";
import type { sidebarProjectType } from "@/src/types/project";
import type { ChatUnreadChannel } from "@/src/types/chat";

// Reuses  same ["projects", workspaceSlug] cache entry  sidebar's own
// project list already populates — private-project visibility is handled
// server-side (getProjectsForSidebar) so this list  already correctly
// filtered per user.
const ChatChannelRail = ({
  workspaceId,
  workspaceSlug,
  activeProjectId,
  activeChannelId,
  onSelect,
  className,
}: {
  workspaceId: number | null | undefined;
  workspaceSlug: string | undefined;
  activeProjectId: number | null;
  activeChannelId: number | null;
  onSelect: (projectId: number | null, channelId?: number | null) => void;
  className?: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", workspaceSlug],
    queryFn: () => getProjectsByWorkspaceSlug(workspaceSlug!),
    enabled: Boolean(workspaceSlug),
  });
  const { data: unreadChannels } = useChatUnread(workspaceId);
  const { isAdminOrOwner } = useCurrentWorkspaceRole(workspaceId ?? undefined);

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggleExpanded = (projectId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const projects: sidebarProjectType[] = data?.projects ?? [];

  return (
    <nav className={cn("flex w-56 shrink-0 flex-col gap-0.5 border-r p-2 overflow-y-auto", className)}>
      <ChannelRow
        label="General"
        isActive={activeProjectId === null}
        isUnread={isChannelUnread(unreadChannels, null, null)}
        onClick={() => onSelect(null, null)}
      />

      <div className="mt-2 px-2 text-xs font-medium text-muted-foreground">Projects</div>

      {isLoading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        projects.map((project) => (
          <ProjectChannelGroup
            key={project.id}
            project={project}
            isExpanded={expanded.has(project.id)}
            onToggleExpand={() => toggleExpanded(project.id)}
            isActive={activeProjectId === project.id}
            activeChannelId={activeProjectId === project.id ? activeChannelId : null}
            unreadChannels={unreadChannels}
            isAdminOrOwner={isAdminOrOwner}
            onSelect={onSelect}
          />
        ))
      )}
    </nav>
  );
};

const ProjectChannelGroup = ({
  project,
  isExpanded,
  onToggleExpand,
  isActive,
  activeChannelId,
  unreadChannels,
  isAdminOrOwner,
  onSelect,
}: {
  project: sidebarProjectType;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isActive: boolean;
  activeChannelId: number | null;
  unreadChannels: ChatUnreadChannel[] | undefined;
  isAdminOrOwner: boolean;
  onSelect: (projectId: number | null, channelId?: number | null) => void;
}) => {
  const { data: channels, isLoading } = useChatChannels(project.id, isExpanded);
  const deleteChannel = useDeleteChatChannel(project.id);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const isMainActive = isActive && activeChannelId === null;

  return (
    <div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggleExpand}
          aria-label={isExpanded ? "Collapse channels" : "Expand channels"}
          className="flex size-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </button>
        <ChannelRow
          label={project.name}
          isActive={isMainActive}
          isUnread={isChannelUnread(unreadChannels, project.id, null)}
          onClick={() => onSelect(project.id, null)}
          className="flex-1"
        />
      </div>

      {isExpanded && (
        <div className="ml-6 flex flex-col gap-0.5 border-l pl-1">
          {isLoading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            channels?.map((channel) => (
              <div key={channel.id} className="group flex items-center">
                <ChannelRow
                  label={channel.name}
                  isActive={isActive && activeChannelId === channel.id}
                  isUnread={isChannelUnread(unreadChannels, project.id, channel.id)}
                  onClick={() => onSelect(project.id, channel.id)}
                  className="flex-1"
                />
                {isAdminOrOwner && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: channel.id, name: channel.name })}
                    aria-label={`Delete #${channel.name}`}
                    className="mr-1 shrink-0 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            ))
          )}

          {isAdminOrOwner && (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Plus className="size-3.5" />
              New channel
            </button>
          )}
        </div>
      )}

      {isAdminOrOwner && (
        <CreateChannelModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          projectId={project.id}
          projectName={project.name}
        />
      )}

      {deleteTarget && (
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContentModal
            title={`Delete #${deleteTarget.name}?`}
            body="This can't be undone. Every message in this channel will be deleted too."
            buttonText="Delete"
            loader={deleteChannel.isPending}
            onContinue={() => {
              deleteChannel.mutate(deleteTarget.id, {
                onSuccess: () => {
                  if (isActive && activeChannelId === deleteTarget.id) {
                    onSelect(project.id, null);
                  }
                  setDeleteTarget(null);
                },
              });
            }}
          />
        </AlertDialog>
      )}
    </div>
  );
};

const ChannelRow = ({
  label,
  isActive,
  isUnread,
  onClick,
  className,
}: {
  label: string;
  isActive: boolean;
  isUnread: boolean;
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm truncate",
      isActive ? "bg-primary-blue/10 text-primary-blue font-medium" : "hover:bg-muted",
      className,
    )}
  >
    <Hash className="size-3.5 shrink-0" />
    <span className={cn("truncate flex-1", isUnread && !isActive && "font-semibold")}>
      {label}
    </span>
    {isUnread && !isActive && <span className="size-1.5 shrink-0 rounded-full bg-destructive" />}
  </button>
);

export default ChatChannelRail;
