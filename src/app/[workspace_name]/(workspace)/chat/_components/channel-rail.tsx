"use client";

import { Hash, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/src/lib/utils";
import { getProjectsByWorkspaceSlug } from "@/src/lib/api/project/services";
import type { sidebarProjectType } from "@/src/types/project";

// Reuses the same ["projects", workspaceSlug] cache entry the sidebar's own
// project list already populates — private-project visibility is handled
// server-side (getProjectsForSidebar), so this list is already correctly
// filtered per user.
const ChatChannelRail = ({
  workspaceSlug,
  activeProjectId,
  onSelect,
}: {
  workspaceSlug: string | undefined;
  activeProjectId: number | null;
  onSelect: (projectId: number | null) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", workspaceSlug],
    queryFn: () => getProjectsByWorkspaceSlug(workspaceSlug!),
    enabled: Boolean(workspaceSlug),
  });

  const projects: sidebarProjectType[] = data?.projects ?? [];

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-0.5 border-r p-2">
      <ChannelRow
        label="General"
        isActive={activeProjectId === null}
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
  onClick,
}: {
  label: string;
  isActive: boolean;
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
    <span className="truncate">{label}</span>
  </button>
);

export default ChatChannelRail;
