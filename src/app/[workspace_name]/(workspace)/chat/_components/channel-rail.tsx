"use client";

import { Hash, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/src/lib/utils";
import { getProjectsByWorkspaceSlug } from "@/src/lib/api/project/services";
import { useChatUnread, isChannelUnread } from "@/src/hooks/use-chat-unread";
import type { sidebarProjectType } from "@/src/types/project";

// Reuses  same ["projects", workspaceSlug] cache entry  sidebar's own
// project list already populates — private-project visibility is handled
// server-side (getProjectsForSidebar) so this list  already correctly
// filtered per user.
const ChatChannelRail = ({
  workspaceId,
  workspaceSlug,
  activeProjectId,
  onSelect,
  className,
}: {
  workspaceId: number | null | undefined;
  workspaceSlug: string | undefined;
  activeProjectId: number | null;
  onSelect: (projectId: number | null) => void;
  className?: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", workspaceSlug],
    queryFn: () => getProjectsByWorkspaceSlug(workspaceSlug!),
    enabled: Boolean(workspaceSlug),
  });
  const { data: unreadChannels } = useChatUnread(workspaceId);

  const projects: sidebarProjectType[] = data?.projects ?? [];

  return (
    <nav className={cn("flex w-56 shrink-0 flex-col gap-0.5 border-r p-2", className)}>
      <ChannelRow
        label="General"
        isActive={activeProjectId === null}
        isUnread={isChannelUnread(unreadChannels, null)}
        onClick={() => onSelect(null)}
      />

      <div className="mt-2 px-2 text-xs font-medium text-muted-foreground">Projects</div>

      {isLoading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        projects.map((project) => (
          <ChannelRow
            key={project.id}
            label={project.name}
            isActive={activeProjectId === project.id}
            isUnread={isChannelUnread(unreadChannels, project.id)}
            onClick={() => onSelect(project.id)}
          />
        ))
      )}
    </nav>
  );
};

const ChannelRow = ({
  label,
  isActive,
  isUnread,
  onClick,
}: {
  label: string;
  isActive: boolean;
  isUnread: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm truncate",
      isActive ? "bg-primary-blue/10 text-primary-blue font-medium" : "hover:bg-muted",
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
