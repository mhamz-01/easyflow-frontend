"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, CheckSquare, Link as LinkIcon, Paperclip } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import Avatar from "@/src/components/custom/avatar";
import tasksIcon from "@/public/icons/tasks.svg";
import docsIcon from "@/public/icons/docs.svg";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import { cn, formatDate } from "@/src/lib/utils";
import { getPriorityStyle, getStateStyle } from "@/src/lib/task-visuals";
import { taskService } from "@/src/lib/api/tasks/service";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useTaskStore } from "@/src/app/[workspace_name]/(workspace)/[project_id]/tasks/store/useTaskStore";

const TaskPreviewModal = ({
  open,
  onOpenChange,
  taskId,
  projectId,
  fallbackTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number;
  projectId: number;
  fallbackTitle: string;
}) => {
  const router = useRouter();
  const workspaceSlug = useWorkspaceStore((s) => s.workspace?.workspaceSlug);

  const { data: task, isLoading } = useQuery({
    queryKey: ["tasks", "byProject", projectId, taskId],
    queryFn: () => taskService.getTaskByProjectId(projectId, taskId),
    enabled: open,
  });

  const priority = task ? getPriorityStyle(task.priority) : null;
  const state = task ? getStateStyle(task.state) : null;
  const overdue = task?.dueDate
    ? new Date(task.dueDate) < new Date() && task.state.toLowerCase() !== "done"
    : false;
  const checklistItemCount =
    task?.checklist?.reduce((sum, group) => sum + group.items.length, 0) ?? 0;

  const openFullTask = () => {
    if (!workspaceSlug) return;
    useTaskStore.getState().setIsOpen(true, taskId);
    router.push(`/${workspaceSlug}/${projectId}/tasks`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[82vh] w-full max-w-xl flex-col gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">{task?.name ?? fallbackTitle}</DialogTitle>

        <div className="flex items-start gap-3 border-b px-6 py-5 pr-12">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-green/15">
            <Image src={tasksIcon} alt="" width={20} height={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">
              {task?.name ?? fallbackTitle}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {state && (
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{ background: state.bg, color: state.color }}
                >
                  {task?.state}
                </span>
              )}
              {priority && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{ background: priority.bg, color: priority.color }}
                >
                  <span className="size-1.5 rounded-full" style={{ background: priority.dot }} />
                  {task?.priority}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading || !task ? (
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-20 w-full animate-pulse rounded-xl bg-muted" />
            </div>
          ) : (
            <div className="flex flex-col gap-5 text-sm">
              {task.description && (
                <p className="whitespace-pre-wrap text-foreground/90">{task.description}</p>
              )}

              <div className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl bg-muted/60 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Assignees</p>
                  <div className="mt-1.5 flex items-center -space-x-1.5">
                    {task.assignees.length === 0 && (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                    {task.assignees.map((a) => (
                      <div key={a.id} title={a.username} className="rounded-full border-2 border-background">
                        <Avatar src={a.imageUrl} width={24} height={24} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Due date</p>
                  <div
                    className={cn(
                      "mt-1.5 flex items-center gap-1.5 text-sm",
                      overdue && "text-destructive",
                    )}
                  >
                    <CalendarIcon className="size-3.5" />
                    {task.dueDate ? formatDate(new Date(task.dueDate)) : "No due date"}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Created by</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Avatar src={task.creator?.imageUrl} width={20} height={20} />
                    <span className="truncate">{task.creator?.username}</span>
                  </div>
                </div>

                {checklistItemCount > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Checklist</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <CheckSquare className="size-3.5" />
                      {checklistItemCount} item{checklistItemCount === 1 ? "" : "s"}
                    </div>
                  </div>
                )}
              </div>

              {(task.documents.length > 0 || task.whiteboards.length > 0) && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground">Linked resources</p>
                  <div className="flex flex-wrap gap-2">
                    {task.documents.map((d) => (
                      <span
                        key={d.id}
                        className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs"
                      >
                        <Image src={docsIcon} alt="" width={14} height={14} /> {d.documentName}
                      </span>
                    ))}
                    {task.whiteboards.map((w) => (
                      <span
                        key={w.id}
                        className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs"
                      >
                        <Image src={whiteboardIcon} alt="" width={14} height={14} /> {w.whiteboardName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {task.links.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Links</p>
                  {task.links.map((link) => (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary-blue hover:underline"
                    >
                      <LinkIcon className="size-3.5" /> {link}
                    </a>
                  ))}
                </div>
              )}

              {task.attachments.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Attachments</p>
                  {task.attachments.map((att) => (
                    <span key={att.id} className="flex items-center gap-1.5 text-xs">
                      <Paperclip className="size-3.5 text-muted-foreground" /> {att.originalName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4">
          <Button onClick={openFullTask} className="w-full" variant="primary">
            Open full task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskPreviewModal;
