"use client";
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "../../shadcn/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../shadcn/collapsible";
import Link from "next/link";
import Image from "next/image";
import { truncateWord } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProject,
  getProjectsByWorkspaceSlug,
} from "@/src/lib/api/project/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { sidebarProjectType } from "@/src/types/project";
import { Dialog, DialogTrigger } from "../../shadcn/dialog";
import CreateProjectModal from "../../modals/create-project";
import { projectSubItems } from "@/src/constants/sidebar";
import { Skeleton } from "../../shadcn/skeleton";
import { useUIStore } from "@/src/store/useUIStore";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger } from "../../shadcn/alert-dialog";
import AlertDialogContentModal from "../../modals/alert-dialog-content";
import { useProjectStore } from "@/src/store/useProjectStore";

const SidebarProjects = () => {
  // states
  const { workspace } = useWorkspaceStore();
  const { isMobile, setOpenMobile } = useSidebar();
  const { modals, openModal, closeModal } = useUIStore();
  const queryClient = useQueryClient();
  const { setProject } = useProjectStore();

  // fetch projects using workspaceId
  const { data, isLoading } = useQuery({
    queryKey: ["projects", workspace?.workspaceSlug],
    queryFn: () => getProjectsByWorkspaceSlug(workspace?.workspaceSlug!),
    enabled: Boolean(workspace?.workspaceSlug),
  });

  // delete project logic
  const { mutate, isPending } = useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", workspace?.workspaceSlug],
      });
      // ✅ remove cached data tied to the deleted project
      queryClient.removeQueries({ queryKey: ["docs", workspace?.id, variables.projectId] });
      queryClient.removeQueries({ queryKey: ["whiteboards", workspace?.id, variables.projectId] });
      queryClient.removeQueries({ queryKey: ["tasks", "project", variables.projectId] });
  
      toast.success("Project deleted!");
      closeModal("isAlertProjectModalOpen");
    },
  });

  // Usage
  const handleDelete = (id: number) => {
    mutate({ projectId: id });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <Dialog
        open={modals.isCreateProjectModalOpen}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            openModal("isCreateProjectModalOpen");
          } else {
            closeModal("isCreateProjectModalOpen");
          }
        }}
      >
        <DialogTrigger
          asChild
          onClick={() => openModal("isCreateProjectModalOpen")}
        >
          <SidebarGroupAction title="Add Project">
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
        </DialogTrigger>
        <CreateProjectModal />
      </Dialog>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading ? (
            // Skeleton loader
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex justify-between gap-2 px-2 py-1">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-4 rounded self-end" />
              </div>
            ))
          ) : data?.projects?.length === 0 ? (
            <p className="text-sm text-muted-foreground px-2">
              You don't have any projects yet
            </p>
          ) : (
            data?.projects?.map((project: sidebarProjectType) => (
              <Collapsible key={project.id}>
                <SidebarMenuItem>
                  {/* collapsible trigger */}
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group flex justify-between">
                      <span>{truncateWord(project.name)}</span>
                      <ChevronRight size={18} 
                       className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90"
                       />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* dropdown menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <AlertDialog
                      open={modals.isAlertProjectModalOpen}
                      onOpenChange={(isOpen) => {
                        if (isOpen) {
                          openModal("isAlertProjectModalOpen");
                        } else {
                          closeModal("isAlertProjectModalOpen");
                        }
                      }}
                    >
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>
                          <span>Edit Project</span>
                        </DropdownMenuItem>
                        <AlertDialogTrigger
                          asChild
                          onClick={() => openModal("isAlertProjectModalOpen")}
                        >
                          <DropdownMenuItem className="text-destructive">
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                      <AlertDialogContentModal
                        body="This action cannot be undone. This will permanently delete your project"
                        loader={isPending}
                        onContinue={() => handleDelete(project.id)}
                      />
                    </AlertDialog>
                  </DropdownMenu>

                  {/* collapsible content */}
                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <SidebarMenuSub>
                      {projectSubItems.map((projectSubItem) => (
                        <SidebarMenuSubItem
                          key={projectSubItem.type}
                          className="mb-1 py-1"
                          onClick={() => {
                            setProject({
                              id: project.id,
                              projectName: project.name,
                            });
                          }}
                        >
                          <Link
                            href={`/${workspace?.workspaceSlug}/${project.id}/${projectSubItem.type}`}
                            onClick={() => {
                              // if it is mobile view
                              if (isMobile) {
                                // close the sidebar when clicked menu item
                                setOpenMobile(false);
                              }
                            }}
                            className="flex items-center gap-1"
                          >
                            <Image
                              src={projectSubItem.icon}
                              width={16}
                              height={16}
                              preload
                              alt="icon"
                            />
                            <span>{truncateWord(projectSubItem.name)}</span>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarProjects;
