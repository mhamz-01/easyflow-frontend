// src/components/modals/select-project-modal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/src/store/useProjectStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/src/components/shadcn/dialog";
import { Skeleton } from "@/src/components/shadcn/skeleton";
import { getProjectsByWorkspaceSlug } from "@/src/lib/api/project/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { sidebarProjectType } from "@/src/types/project";
import { FolderPlus, ArrowRight, Plus } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import CreateProjectModal from "./create-project";
import { useUIStore } from "@/src/store/useUIStore";

type ActionType = "whiteboards" | "docs" | "tasks";

interface SelectProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
  actionLabel: string;
  actionIcon: StaticImageData;
}

const SelectProjectModal = ({
  isOpen,
  onClose,
  actionType,
  actionLabel,
  actionIcon,
}: SelectProjectModalProps) => {
    const { setProject } = useProjectStore();
  const router = useRouter();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const { openModal } = useUIStore();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["projects", workspace?.workspaceSlug],
    queryFn: () => getProjectsByWorkspaceSlug(workspace!.workspaceSlug),
    enabled: !!workspace?.workspaceSlug && isOpen,
  });

  const projects: sidebarProjectType[] = data?.projects ?? [];

  const handleSelectProject = (projectId: number, projectName: string) => {
    setProject({ id: projectId, projectName }); // ✅ update store first
    onClose();
    router.push(`/${workspace?.workspaceSlug}/${projectId}/${actionType}`);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-popover border border-border text-popover-foreground sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg  border border-border">
              <Image src={actionIcon} alt={actionLabel} width={20} height={20} />
            </span>
            <div>
              <DialogTitle className="text-base text-left font-semibold">
                Select a project
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Choose where this {actionLabel.toLowerCase()} should live
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-3 pb-3 max-h-[320px] overflow-y-auto">
          {isLoading && (
            <div className="space-y-2 px-3 py-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg bg-muted" />
              ))}
            </div>
          )}

          {!isLoading && projects.length === 0 && (
            <div className="flex flex-col items-center text-center gap-3 py-10 px-6">
              <span className="p-3 rounded-full bg-muted border border-border">
                <FolderPlus className="w-5 h-5 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm font-medium">No projects yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create a project first to add a {actionLabel.toLowerCase()}
                </p>
              </div>
              <Dialog onOpenChange={(open) => open && openModal("isCreateProjectModalOpen")}>
                <DialogTrigger asChild>
                  <button className="mt-1 text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    Create project
                  </button>
                </DialogTrigger>
                <CreateProjectModal />
              </Dialog>
            </div>
          )}

          {!isLoading && projects.length > 0 && (
            <>
              {projects.map((project) => (
                <button
                  key={project.id}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleSelectProject(project.id, project.name)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left group"
                >
                  <span className="text-sm font-medium truncate">{project.name}</span>
                  <ArrowRight
                    size={15}
                    className={`text-muted-foreground transition-transform duration-200 ${
                      hoveredId === project.id ? "translate-x-0.5 text-foreground" : ""
                    }`}
                  />
                </button>
              ))}
              <Dialog onOpenChange={(open) => open && openModal("isCreateProjectModalOpen")}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center gap-2 px-4 py-3 mt-1 rounded-lg hover:bg-accent transition-colors text-left text-muted-foreground hover:text-accent-foreground">
                    <Plus size={15} />
                    <span className="text-sm">New project</span>
                  </button>
                </DialogTrigger>
                <CreateProjectModal />
              </Dialog>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectProjectModal;