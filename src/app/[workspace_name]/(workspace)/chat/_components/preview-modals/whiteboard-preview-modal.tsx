"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import Avatar from "@/src/components/custom/avatar";
import tasksIcon from "@/public/icons/tasks.svg";
import docsIcon from "@/public/icons/docs.svg";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import { getSingleWhiteboard } from "@/src/lib/api/whiteboards/services";
import { getStateStyle } from "@/src/lib/task-visuals";
import type { UserSummary } from "@/src/types/whiteboard";

const WhiteboardPreviewModal = ({
  open,
  onOpenChange,
  whiteboardId,
  title,
  assignees,
  creator,
  workspaceSlug,
  projectId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  whiteboardId: number;
  title: string;
  assignees: UserSummary[];
  creator?: UserSummary;
  workspaceSlug: string | undefined;
  projectId: number;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["whiteboard", whiteboardId],
    queryFn: () => getSingleWhiteboard(whiteboardId),
    enabled: open,
  });

  const content = data?.whiteboard.content;
  const tasks = content?.tasks ?? [];
  const documents = content?.documents ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[82vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div
          className="border-b px-6 py-5 pr-12"
          style={{
            backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-yellow/15">
              <Image src={whiteboardIcon} alt="" width={20} height={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">{title}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {creator && <span>Created by {creator.username}</span>}
                {assignees.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex items-center -space-x-1.5">
                      {assignees.slice(0, 4).map((a) => (
                        <div
                          key={a.id}
                          title={a.username}
                          className="rounded-full border-2 border-background"
                        >
                          <Avatar src={a.imageUrl} width={20} height={20} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-14 w-full animate-pulse rounded-lg bg-muted" />
              <div className="h-14 w-full animate-pulse rounded-lg bg-muted" />
            </div>
          ) : tasks.length === 0 && documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
              <Image src={whiteboardIcon} alt="" width={32} height={32} className="opacity-40" />
              <p className="text-sm">This whiteboard is empty — open it to start creating.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {tasks.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {tasks.length} task{tasks.length === 1 ? "" : "s"} on this board
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {tasks.map((t) => {
                      const state = getStateStyle(t.status);
                      return (
                        <div
                          key={t.id}
                          className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm"
                        >
                          <Image src={tasksIcon} alt="" width={14} height={14} className="shrink-0" />
                          <span className="flex-1 truncate">{t.title}</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{ background: state.bg, color: state.color }}
                          >
                            {t.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {documents.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {documents.length} document{documents.length === 1 ? "" : "s"} on this board
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {documents.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm"
                      >
                        <Image src={docsIcon} alt="" width={14} height={14} className="shrink-0" />
                        <span className="flex-1 truncate">{d.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4">
          {workspaceSlug && (
            <Button asChild className="w-full" variant="primary">
              <Link
                href={`/${workspaceSlug}/${projectId}/whiteboards/${whiteboardId}`}
                onClick={() => onOpenChange(false)}
              >
                Open whiteboard
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhiteboardPreviewModal;
