"use client";
import { Button } from "../../../../../components/shadcn/button";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import CreateItemModal from "@/src/components/modals/create-item-modal";
import {
  SidebarTrigger,
  useSidebar,
} from "../../../../../components/shadcn/sidebar";
import Breadcrumbs from "../../../../../components/custom/breadcrumbs";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useAuth } from "@clerk/nextjs";
import { createWhiteboard, getSingleWhiteboard } from "@/src/lib/api/whiteboards/services";
import { Spinner } from "../../../../../components/shadcn/spinner";
import { Ellipsis, Maximize, Users, X, ArrowLeft, GripHorizontal, Plus } from "lucide-react";
import { createdWhiteboardResponse, whiteboardsListResponse } from "@/src/types/whiteboard";
import { useState } from "react";
import ShareWhiteboardModal from "@/src/components/modals/share-whiteboard-modal";
import { trackActivity } from "@/src/lib/api/recent-activities/track";

export function WhiteboardHeader() {
  const { open } = useSidebar();
  const params = useParams<{ id?: string }>();
  const isEditorPage = !!params?.id;
  const workspace = useWorkspaceStore((s) => s.workspace);
  const project = useProjectStore((s) => s.project);
  const { userId } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showBar, setShowBar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const whiteboardId = params?.id ? Number(params.id) : null;



  const { data: whiteboardData } = useQuery({
    queryKey: ["whiteboard", whiteboardId],
    queryFn: () => getSingleWhiteboard(whiteboardId!),
    enabled: !!whiteboardId,
  });



  const mutationWhiteboard = useMutation({
    mutationFn: createWhiteboard,
    onSuccess: (data: createdWhiteboardResponse) => {
      setIsOpen(false);
      router.push(`whiteboards/${data.createdDoc.id}`);
  
      // ✅ track activity
      if (workspace?.id && project?.id && userId) {
        trackActivity({
          workspaceId: workspace.id,
          userId,
          title: data.createdDoc.whiteboardName,
          type: "WHITEBOARD",
          typeID: data.createdDoc.id,
          projectID: project.id,
          lastEditedBy: userId,
        });
      }
  
      queryClient.setQueryData(
        ["whiteboards", workspace?.id, project?.id],
        (oldData: Partial<whiteboardsListResponse>) => ({
          ...oldData,
          whiteboards: [
            {
              id: data.createdDoc.id,
              whiteboardName: data.createdDoc.whiteboardName,
              assignees: data.createdDoc.assignees,
              isPrivate: data.createdDoc.isPrivate,
            },
            ...(oldData.whiteboards || []),
          ],
        }),
      );
    },
  });
  // why here createdDoc is used?

  const handleCreate = (name: string, isPrivate:boolean) => {
    if (workspace?.id && project?.id && userId) {
      mutationWhiteboard.mutate({
        workspaceId: workspace?.id,
        projectId: project?.id,
        createdBy: userId,
        whiteboardName: name,
        isPrivate,
      });
    }
  };

  // ─── Listing Page Header ───────────────────────────────────────────────────
  if (!isEditorPage) {
    return (
      <section className="flex items-center justify-between p-4 gap-2">
        {/* Left */}
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger className={!open ? "" : "md:hidden"} />
          <div className="truncate">
            <Breadcrumbs
              items={[
                { label: "Home", path: `/${workspace?.workspaceSlug ?? "/"}` },
                { label: project?.projectName, path: "#" },
                { label: "Whiteboard", path: "" },
              ]}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Icons hidden on mobile */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" disabled={mutationWhiteboard.isPending}>
                {mutationWhiteboard.isPending ? (
                  <Spinner />
                ) : (
                  <>
                    <span className="max-sm:hidden">Create Whiteboard</span>
                    <Plus size={18} className="inline sm:hidden" />
                  </>
                )}
              </Button>
            </DialogTrigger>
            <CreateItemModal
              title="Create Whiteboard"
              description="Enter a name for your new whiteboard."
              label="Whiteboard Name"
              placeholder="e.g. Project Brainstorming"
              buttonText="Create Whiteboard"
              isPending={mutationWhiteboard.isPending}
              onSubmit={handleCreate}
            />
          </Dialog>
        </div>
      </section>
    );
  }

  // ─── Editor Page Floating Bar ──────────────────────────────────────────────
  return (
    <>
      {/* Hint tab */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
        onMouseEnter={() => setShowBar(true)}
        onClick={() => setShowBar((v) => !v)}
      >
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-b-xl text-xs transition-all duration-300 
            bg-background/60 backdrop-blur-sm border border-t-0 shadow-sm text-muted-foreground
            ${showBar ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <GripHorizontal size={12} />
          {/* Both always in DOM — CSS toggles which is visible */}
          <span className="max-sm:hidden">hover for toolbar</span>
          <span className="inline sm:hidden">tap for toolbar</span>
        </div>
      </div>

      {/* Floating bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${showBar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        onMouseLeave={() => setShowBar(false)}
      >
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 bg-background/90 backdrop-blur-md border-b shadow-md gap-2">
          {/* Left */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground px-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="max-sm:hidden">Back</span>
            </Button>
            <span className="h-4 w-px bg-border" />
            <SidebarTrigger className={!open ? "" : "md:hidden"} />
            <div className="hidden md:block truncate">
              <Breadcrumbs
                items={[
                  { label: "Home", path: `/${workspace?.workspaceSlug ?? "/"}` },
                  { label: project?.projectName, path: "#" },
                  { label: "Whiteboard", path: "" },
                ]}
              />
            </div>
          </div>

          {/* Center */}
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-tight truncate max-w-[30%] text-center">
            {project?.projectName ?? "Whiteboard"}
          </span>

          {/* Right */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border bg-muted/40 text-muted-foreground">
              <button className="hover:text-foreground transition-colors" title="Collaborators">
                <Users size={15} />
              </button>
              <span className="hidden sm:block h-3.5 w-px bg-border" />
              <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
  <button onClick={() => setIsShareOpen(true)}>Share</button>
  {isShareOpen && whiteboardId && (
    <ShareWhiteboardModal
      whiteboardId={whiteboardId}
      whiteboardName={whiteboardData?.whiteboard.whiteboardName ?? ""}
      existingAssignees={whiteboardData?.whiteboard.assignees ?? []}
      onClose={() => setIsShareOpen(false)}
    />
  )}
</Dialog>
              {/* <span className="h-3.5 w-px bg-border" /> */}
              {/* <button className="hover:text-foreground transition-colors" title="More options">
                <Ellipsis size={15} />
              </button>
              <span className="hidden sm:block h-3.5 w-px bg-border" />
              <button className="hidden sm:block hover:text-foreground transition-colors" title="Fullscreen">
                <Maximize size={15} />
              </button> */}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="primary" disabled={mutationWhiteboard.isPending}>
                  {mutationWhiteboard.isPending ? (
                    <Spinner />
                  ) : (
                    <>
                      <span className="max-sm:hidden">Create Whiteboard</span>
                      <Plus size={18} className="inline sm:hidden" />
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <CreateItemModal
                title="Create Whiteboard"
                description="Enter a name for your new Whiteboard."
                label="Whiteboard Name"
                placeholder="e.g. Meeting Notes"
                buttonText="Create Whiteboard"
                isPending={mutationWhiteboard.isPending}
                onSubmit={handleCreate}
              />
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}