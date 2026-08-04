"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, FileText, ListChecks, Loader2, PenTool } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/shadcn/tabs";
import { taskService } from "@/src/lib/api/tasks/service";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { getAllWhiteboards } from "@/src/lib/api/whiteboards/services";
import { getProjectsByWorkspaceSlug } from "@/src/lib/api/project/services";
import type { ChatAttachment } from "@/src/types/chat";
import type { sidebarProjectType } from "@/src/types/project";

// Two modes, one component:
//  - project channel (projectId known): resource picker scoped to that project.
//  - General (projectId null): pick a project first, then the same resource
//    picker scoped to whichever project was chosen.
const AttachmentPicker = ({
  open,
  onOpenChange,
  workspaceId,
  workspaceSlug,
  projectId,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: number;
  workspaceSlug: string | undefined;
  projectId: number | null;
  onPick: (attachment: ChatAttachment) => void;
}) => {
  const [pickedProject, setPickedProject] = useState<sidebarProjectType | null>(null);

  const scopedProjectId = projectId ?? pickedProject?.id ?? null;

  const handleOpenChange = (next: boolean) => {
    if (!next) setPickedProject(null);
    onOpenChange(next);
  };

  const handlePick = (attachment: ChatAttachment) => {
    onPick(attachment);
    setPickedProject(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {scopedProjectId === null ? "Share from a project" : "Share"}
          </DialogTitle>
        </DialogHeader>

        {scopedProjectId === null ? (
          <ProjectStep workspaceSlug={workspaceSlug} onPick={setPickedProject} />
        ) : (
          <>
            {projectId === null && pickedProject && (
              <button
                type="button"
                onClick={() => setPickedProject(null)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="size-4" /> {pickedProject.name}
              </button>
            )}
            <ResourceStep
              workspaceId={workspaceId}
              projectId={scopedProjectId}
              onPick={handlePick}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ProjectStep = ({
  workspaceSlug,
  onPick,
}: {
  workspaceSlug: string | undefined;
  onPick: (project: sidebarProjectType) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", workspaceSlug],
    queryFn: () => getProjectsByWorkspaceSlug(workspaceSlug!),
    enabled: Boolean(workspaceSlug),
  });

  const projects: sidebarProjectType[] = data?.projects ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projects.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">No projects to share from.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {projects.map((project) => (
        <Button
          key={project.id}
          variant="ghost"
          className="justify-start"
          onClick={() => onPick(project)}
        >
          {project.name}
        </Button>
      ))}
    </div>
  );
};

const ResourceStep = ({
  workspaceId,
  projectId,
  onPick,
}: {
  workspaceId: number;
  projectId: number;
  onPick: (attachment: ChatAttachment) => void;
}) => {
  const tasksQuery = useQuery({
    queryKey: ["tasks", "project", projectId, "picker"],
    queryFn: () => taskService.getTasksByProject(projectId, { limit: 50 }),
  });
  const docsQuery = useQuery({
    queryKey: ["docs", workspaceId, projectId],
    queryFn: () => getAllDocs({ workspaceId, projectId }),
  });
  const whiteboardsQuery = useQuery({
    queryKey: ["whiteboards", workspaceId, projectId],
    queryFn: () => getAllWhiteboards({ workspaceId, projectId }),
  });

  return (
    <Tabs defaultValue="tasks">
      <TabsList>
        <TabsTrigger value="tasks">
          <ListChecks className="size-4" /> Tasks
        </TabsTrigger>
        <TabsTrigger value="documents">
          <FileText className="size-4" /> Documents
        </TabsTrigger>
        <TabsTrigger value="whiteboards">
          <PenTool className="size-4" /> Whiteboards
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tasks">
        <PickerList
          isLoading={tasksQuery.isLoading}
          items={(tasksQuery.data?.tasks ?? []).map((t) => ({ id: t.id, label: t.name }))}
          emptyLabel="No tasks in this project."
          onPick={(item) =>
            onPick({ type: "task", id: item.id, title: item.label, projectId })
          }
        />
      </TabsContent>

      <TabsContent value="documents">
        <PickerList
          isLoading={docsQuery.isLoading}
          items={(docsQuery.data?.docs ?? []).map((d) => ({ id: d.id, label: d.documentName }))}
          emptyLabel="No documents in this project."
          onPick={(item) =>
            onPick({ type: "document", id: item.id, title: item.label, projectId })
          }
        />
      </TabsContent>

      <TabsContent value="whiteboards">
        <PickerList
          isLoading={whiteboardsQuery.isLoading}
          items={(whiteboardsQuery.data?.whiteboards ?? []).map((w) => ({
            id: w.id,
            label: w.whiteboardName,
          }))}
          emptyLabel="No whiteboards in this project."
          onPick={(item) =>
            onPick({ type: "whiteboard", id: item.id, title: item.label, projectId })
          }
        />
      </TabsContent>
    </Tabs>
  );
};

const PickerList = ({
  isLoading,
  items,
  emptyLabel,
  onPick,
}: {
  isLoading: boolean;
  items: { id: number; label: string }[];
  emptyLabel: string;
  onPick: (item: { id: number; label: string }) => void;
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className="justify-start"
          onClick={() => onPick(item)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default AttachmentPicker;
