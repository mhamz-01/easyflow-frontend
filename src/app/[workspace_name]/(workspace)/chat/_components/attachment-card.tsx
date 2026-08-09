"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { cn, formatDate } from "@/src/lib/utils";
import Avatar from "@/src/components/custom/avatar";
import tasksIcon from "@/public/icons/tasks.svg";
import docsIcon from "@/public/icons/docs.svg";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { getAllWhiteboards } from "@/src/lib/api/whiteboards/services";
import { taskService } from "@/src/lib/api/tasks/service";
import { getPriorityStyle, getStateStyle } from "@/src/lib/task-visuals";
import { useWorkspaceStore } from "@/src/store/workspace";
import { docsListKey, tasksSummaryKey, whiteboardsListKey } from "./query-keys";
import DocPreviewModal from "./preview-modals/doc-preview-modal";
import TaskPreviewModal from "./preview-modals/task-preview-modal";
import WhiteboardPreviewModal from "./preview-modals/whiteboard-preview-modal";
import type { ChatAttachment } from "@/src/types/chat";

const cardBase =
  "flex w-full items-start gap-2.5 rounded-xl border bg-background px-3.5 py-3 text-left text-sm transition-colors hover:border-foreground/25";

export const AttachmentCard = ({
  attachment,
  pending,
}: {
  attachment: ChatAttachment;
  pending: boolean;
}) => {
  if (attachment.type === "task") {
    return <TaskAttachmentCard attachment={attachment} pending={pending} />;
  }
  if (attachment.type === "document") {
    return <DocAttachmentCard attachment={attachment} pending={pending} />;
  }
  return <WhiteboardAttachmentCard attachment={attachment} pending={pending} />;
};

// ─── Task ───────────────────────────────────────────────────────────────────

const TaskAttachmentCard = ({
  attachment,
  pending,
}: {
  attachment: ChatAttachment;
  pending: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: tasksSummaryKey(attachment.projectId),
    queryFn: () => taskService.getTasksByProject(attachment.projectId, { limit: 100 }),
  });
  const task = data?.tasks.find((t) => t.id === attachment.id);
  const priority = task ? getPriorityStyle(task.priority) : null;
  const state = task ? getStateStyle(task.state) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(cardBase, pending && "opacity-60")}
      >
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-green/15">
          <Image src={tasksIcon} alt="" width={16} height={16} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="truncate font-medium">{attachment.title}</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {state && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: state.bg, color: state.color }}
              >
                {task?.state}
              </span>
            )}
            {priority && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: priority.bg, color: priority.color }}
              >
                <span className="size-1.5 rounded-full" style={{ background: priority.dot }} />
                {task?.priority}
              </span>
            )}
            {task?.dueDate && (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <CalendarIcon className="size-3" /> {formatDate(new Date(task.dueDate))}
              </span>
            )}
          </div>
          {task && task.assignees.length > 0 && (
            <div className="flex items-center -space-x-1.5">
              {task.assignees.slice(0, 4).map((a) => (
                <div key={a.id} title={a.username} className="rounded-full border-2 border-background">
                  <Avatar src={a.imageUrl} width={18} height={18} />
                </div>
              ))}
            </div>
          )}
        </div>
      </button>
      <TaskPreviewModal
        open={open}
        onOpenChange={setOpen}
        taskId={attachment.id}
        projectId={attachment.projectId}
        fallbackTitle={attachment.title}
      />
    </>
  );
};

// ─── Document ───────────────────────────────────────────────────────────────

const DocAttachmentCard = ({
  attachment,
  pending,
}: {
  attachment: ChatAttachment;
  pending: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const workspaceSlug = useWorkspaceStore((s) => s.workspace?.workspaceSlug);
  const { data } = useQuery({
    queryKey: docsListKey(workspaceId, attachment.projectId),
    queryFn: () => getAllDocs({ workspaceId: workspaceId as number, projectId: attachment.projectId }),
    enabled: !!workspaceId,
  });
  const doc = data?.docs.find((d) => d.id === attachment.id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(cardBase, pending && "opacity-60")}
      >
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-blue/15">
          <Image src={docsIcon} alt="" width={16} height={16} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate font-medium">{attachment.title}</span>
          {doc?.preview && (
            <span className="line-clamp-2 text-xs text-muted-foreground">{doc.preview}</span>
          )}
          {doc && doc.assignees.length > 0 && (
            <div className="mt-0.5 flex items-center -space-x-1.5">
              {doc.assignees.slice(0, 4).map((a) => (
                <div key={a.id} title={a.username} className="rounded-full border-2 border-background">
                  <Avatar src={a.imageUrl} width={18} height={18} />
                </div>
              ))}
            </div>
          )}
        </div>
      </button>
      <DocPreviewModal
        open={open}
        onOpenChange={setOpen}
        docId={attachment.id}
        title={attachment.title}
        assignees={doc?.assignees ?? []}
        workspaceSlug={workspaceSlug}
        projectId={attachment.projectId}
      />
    </>
  );
};

// ─── Whiteboard ─────────────────────────────────────────────────────────────

const WhiteboardAttachmentCard = ({
  attachment,
  pending,
}: {
  attachment: ChatAttachment;
  pending: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const workspaceSlug = useWorkspaceStore((s) => s.workspace?.workspaceSlug);
  const { data } = useQuery({
    queryKey: whiteboardsListKey(workspaceId, attachment.projectId),
    queryFn: () =>
      getAllWhiteboards({ workspaceId: workspaceId as number, projectId: attachment.projectId }),
    enabled: !!workspaceId,
  });
  const whiteboard = data?.whiteboards.find((w) => w.id === attachment.id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(cardBase, pending && "opacity-60")}
      >
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-yellow/15">
          <Image src={whiteboardIcon} alt="" width={16} height={16} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate font-medium">{attachment.title}</span>
          <span className="text-xs text-muted-foreground">Whiteboard</span>
          {whiteboard && (whiteboard.creator || (whiteboard.assignees?.length ?? 0) > 0) && (
            <div className="mt-0.5 flex items-center -space-x-1.5">
              {whiteboard.creator && (
                <div
                  title={whiteboard.creator.username}
                  className="rounded-full border-2 border-background"
                >
                  <Avatar src={whiteboard.creator.imageUrl} width={18} height={18} />
                </div>
              )}
              {whiteboard.assignees?.slice(0, 3).map((a) => (
                <div key={a.id} title={a.username} className="rounded-full border-2 border-background">
                  <Avatar src={a.imageUrl} width={18} height={18} />
                </div>
              ))}
            </div>
          )}
        </div>
      </button>
      <WhiteboardPreviewModal
        open={open}
        onOpenChange={setOpen}
        whiteboardId={attachment.id}
        title={attachment.title}
        assignees={whiteboard?.assignees ?? []}
        creator={whiteboard?.creator}
        workspaceSlug={workspaceSlug}
        projectId={attachment.projectId}
      />
    </>
  );
};
