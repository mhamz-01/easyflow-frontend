"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2, Paperclip, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/shadcn/popover";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import Avatar from "@/src/components/custom/avatar";
import tasksIcon from "@/public/icons/tasks.svg";
import docsIcon from "@/public/icons/docs.svg";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import { cn, filterBySearch } from "@/src/lib/utils";
import { taskService } from "@/src/lib/api/tasks/service";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { getAllWhiteboards } from "@/src/lib/api/whiteboards/services";
import { getProjectsByWorkspaceSlug } from "@/src/lib/api/project/services";
import { getPriorityStyle, getStateStyle } from "@/src/lib/task-visuals";
import { docsListKey, tasksSummaryKey, whiteboardsListKey } from "./query-keys";
import type { ChatAttachment } from "@/src/types/chat";
import type { sidebarProjectType } from "@/src/types/project";
import type { Doc } from "@/src/types/documents";
import type { Whiteboard } from "@/src/types/whiteboard";
import type { TaskViewList } from "@/src/types/tasks";

type AttachmentType = ChatAttachment["type"];
type Step = "project" | "type" | "items";

// Two modes, one component:
//  - project channel (projectId known): jumps straight to the type step.
//  - General (projectId null): pick a project first, then the same type +
//    items steps, scoped to whichever project was chosen.
// Icons/colors mirror the app's own branding for these sections (sidebar
// nav, home page action tiles): Tasks = green, Documents = blue,
// Whiteboards = yellow — not an invented chat-only palette.
const TYPE_META: Record<
  AttachmentType,
  { label: string; description: string; icon: StaticImageData; iconWrap: string; hoverBorder: string }
> = {
  task: {
    label: "Task",
    description: "Share a task with its status & assignees",
    icon: tasksIcon,
    iconWrap: "bg-primary-green/15",
    hoverBorder: "hover:border-primary-green/40",
  },
  document: {
    label: "Document",
    description: "Share a doc with a live preview",
    icon: docsIcon,
    iconWrap: "bg-primary-blue/15",
    hoverBorder: "hover:border-primary-blue/40",
  },
  whiteboard: {
    label: "Whiteboard",
    description: "Share a whiteboard and what's on it",
    icon: whiteboardIcon,
    iconWrap: "bg-primary-yellow/15",
    hoverBorder: "hover:border-primary-yellow/40",
  },
};

const AttachmentPicker = ({
  workspaceId,
  workspaceSlug,
  projectId,
  onPick,
}: {
  workspaceId: number;
  workspaceSlug: string | undefined;
  projectId: number | null;
  onPick: (attachment: ChatAttachment) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [pickedProject, setPickedProject] = useState<sidebarProjectType | null>(null);
  const [pickedType, setPickedType] = useState<AttachmentType | null>(null);

  const scopedProjectId = projectId ?? pickedProject?.id ?? null;
  const step: Step = scopedProjectId === null ? "project" : pickedType === null ? "type" : "items";
  const canGoBack = step === "items" || (step === "type" && projectId === null);

  const reset = () => {
    setPickedProject(null);
    setPickedType(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    setOpen(next);
  };

  const handlePick = (attachment: ChatAttachment) => {
    onPick(attachment);
    reset();
    setOpen(false);
  };

  const goBack = () => {
    if (step === "items") setPickedType(null);
    else if (step === "type" && projectId === null) setPickedProject(null);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Attach a task, document, or whiteboard">
          <Paperclip />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="top"
        sideOffset={10}
        className="w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border p-0 shadow-xl"
      >
        <div className="flex items-center gap-2 border-b px-4 py-3">
          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          {step === "items" && pickedType && (
            <Image src={TYPE_META[pickedType].icon} alt="" width={16} height={16} className="shrink-0" />
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">
              {step === "project" && "Share from a project"}
              {step === "type" && "What do you want to share?"}
              {step === "items" && pickedType && `${TYPE_META[pickedType].label}s`}
            </span>
            {step === "items" && projectId === null && pickedProject && (
              <span className="truncate text-xs text-muted-foreground">{pickedProject.name}</span>
            )}
          </div>
        </div>

        <div className="max-h-[26rem] overflow-y-auto">
          {step === "project" && (
            <ProjectStep workspaceSlug={workspaceSlug} onPick={setPickedProject} />
          )}
          {step === "type" && scopedProjectId !== null && <TypeStep onPick={setPickedType} />}
          {step === "items" && scopedProjectId !== null && pickedType && (
            <ItemsStep
              type={pickedType}
              workspaceId={workspaceId}
              projectId={scopedProjectId}
              onPick={handlePick}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ─── Shared bits ────────────────────────────────────────────────────────────

const CenteredLoader = () => (
  <div className="flex justify-center py-10">
    <Loader2 className="size-5 animate-spin text-muted-foreground" />
  </div>
);

const EmptyState = ({ label }: { label: string }) => (
  <p className="px-4 py-10 text-center text-sm text-muted-foreground">{label}</p>
);

const SearchBox = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <div className="sticky top-0 z-10 bg-popover px-3 pb-2 pt-3">
    <div className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 pl-8 text-sm"
      />
    </div>
  </div>
);

// ─── Step: project (General channel only) ──────────────────────────────────

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

  if (isLoading) return <CenteredLoader />;
  if (projects.length === 0) return <EmptyState label="No projects to share from." />;

  return (
    <div className="flex flex-col gap-1 p-2">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => onPick(project)}
          className="rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
        >
          {project.name}
        </button>
      ))}
    </div>
  );
};

// ─── Step: type ─────────────────────────────────────────────────────────────

const TypeStep = ({ onPick }: { onPick: (type: AttachmentType) => void }) => (
  <div className="flex flex-col gap-2 p-3">
    {(Object.keys(TYPE_META) as AttachmentType[]).map((type) => {
      const meta = TYPE_META[type];
      return (
        <button
          key={type}
          type="button"
          onClick={() => onPick(type)}
          className={cn(
            "group flex items-center gap-3 rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
            meta.hoverBorder,
          )}
        >
          <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", meta.iconWrap)}>
            <Image src={meta.icon} alt="" width={20} height={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{meta.label}</span>
            <span className="text-xs text-muted-foreground">{meta.description}</span>
          </div>
        </button>
      );
    })}
  </div>
);

// ─── Step: items ────────────────────────────────────────────────────────────

const ItemsStep = ({
  type,
  workspaceId,
  projectId,
  onPick,
}: {
  type: AttachmentType;
  workspaceId: number;
  projectId: number;
  onPick: (attachment: ChatAttachment) => void;
}) => {
  const [query, setQuery] = useState("");

  if (type === "task") {
    return <TaskItemsList projectId={projectId} query={query} onQueryChange={setQuery} onPick={onPick} />;
  }
  if (type === "document") {
    return (
      <DocItemsList
        workspaceId={workspaceId}
        projectId={projectId}
        query={query}
        onQueryChange={setQuery}
        onPick={onPick}
      />
    );
  }
  return (
    <WhiteboardItemsList
      workspaceId={workspaceId}
      projectId={projectId}
      query={query}
      onQueryChange={setQuery}
      onPick={onPick}
    />
  );
};

const TaskItemsList = ({
  projectId,
  query,
  onQueryChange,
  onPick,
}: {
  projectId: number;
  query: string;
  onQueryChange: (v: string) => void;
  onPick: (attachment: ChatAttachment) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: tasksSummaryKey(projectId),
    queryFn: () => taskService.getTasksByProject(projectId, { limit: 100 }),
  });
  const tasks = filterBySearch<TaskViewList>(data?.tasks ?? [], query, "name");

  return (
    <div className="flex flex-col">
      <SearchBox value={query} onChange={onQueryChange} placeholder="Search tasks…" />
      {isLoading ? (
        <CenteredLoader />
      ) : tasks.length === 0 ? (
        <EmptyState label="No tasks found." />
      ) : (
        <div className="flex flex-col gap-1 p-2 pt-0">
          {tasks.map((task) => {
            const priority = getPriorityStyle(task.priority);
            const state = getStateStyle(task.state);
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onPick({ type: "task", id: task.id, title: task.name, projectId })}
                className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: priority.dot }} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-sm font-medium">{task.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                      style={{ background: state.bg, color: state.color }}
                    >
                      {task.state}
                    </span>
                    {task.assignees.length > 0 && (
                      <div className="flex items-center -space-x-1">
                        {task.assignees.slice(0, 3).map((a) => (
                          <div key={a.id} className="rounded-full border-2 border-background">
                            <Avatar src={a.imageUrl} width={16} height={16} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DocItemsList = ({
  workspaceId,
  projectId,
  query,
  onQueryChange,
  onPick,
}: {
  workspaceId: number;
  projectId: number;
  query: string;
  onQueryChange: (v: string) => void;
  onPick: (attachment: ChatAttachment) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: docsListKey(workspaceId, projectId),
    queryFn: () => getAllDocs({ workspaceId, projectId }),
  });
  const docs = filterBySearch<Doc>(data?.docs ?? [], query, "documentName");

  return (
    <div className="flex flex-col">
      <SearchBox value={query} onChange={onQueryChange} placeholder="Search documents…" />
      {isLoading ? (
        <CenteredLoader />
      ) : docs.length === 0 ? (
        <EmptyState label="No documents found." />
      ) : (
        <div className="flex flex-col gap-1 p-2 pt-0">
          {docs.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onPick({ type: "document", id: doc.id, title: doc.documentName, projectId })}
              className="flex flex-col gap-1 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{doc.documentName}</span>
                {doc.assignees.length > 0 && (
                  <div className="flex shrink-0 items-center -space-x-1">
                    {doc.assignees.slice(0, 3).map((a) => (
                      <div key={a.id} className="rounded-full border-2 border-background">
                        <Avatar src={a.imageUrl} width={16} height={16} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {doc.preview && (
                <span className="line-clamp-1 text-xs text-muted-foreground">{doc.preview}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const WhiteboardItemsList = ({
  workspaceId,
  projectId,
  query,
  onQueryChange,
  onPick,
}: {
  workspaceId: number;
  projectId: number;
  query: string;
  onQueryChange: (v: string) => void;
  onPick: (attachment: ChatAttachment) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: whiteboardsListKey(workspaceId, projectId),
    queryFn: () => getAllWhiteboards({ workspaceId, projectId }),
  });
  const whiteboards = filterBySearch<Whiteboard>(data?.whiteboards ?? [], query, "whiteboardName");

  return (
    <div className="flex flex-col">
      <SearchBox value={query} onChange={onQueryChange} placeholder="Search whiteboards…" />
      {isLoading ? (
        <CenteredLoader />
      ) : whiteboards.length === 0 ? (
        <EmptyState label="No whiteboards found." />
      ) : (
        <div className="flex flex-col gap-1 p-2 pt-0">
          {whiteboards.map((whiteboard) => (
            <button
              key={whiteboard.id}
              type="button"
              onClick={() =>
                onPick({ type: "whiteboard", id: whiteboard.id, title: whiteboard.whiteboardName, projectId })
              }
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
            >
              <span className="truncate text-sm font-medium">{whiteboard.whiteboardName}</span>
              {(whiteboard.assignees?.length ?? 0) > 0 && (
                <div className="flex shrink-0 items-center -space-x-1">
                  {whiteboard.assignees!.slice(0, 3).map((a) => (
                    <div key={a.id} className="rounded-full border-2 border-background">
                      <Avatar src={a.imageUrl} width={16} height={16} />
                    </div>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentPicker;
