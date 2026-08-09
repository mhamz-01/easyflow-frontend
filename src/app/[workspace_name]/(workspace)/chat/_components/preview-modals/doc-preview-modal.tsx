"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { SquareArrowOutUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import Avatar from "@/src/components/custom/avatar";
import docsIcon from "@/public/icons/docs.svg";
import { getSingleDoc } from "@/src/lib/api/documents/services";
import type { DocAssignee } from "@/src/types/documents";
import DocContentViewer from "./doc-content-viewer";

const DocPreviewModal = ({
  open,
  onOpenChange,
  docId,
  title,
  assignees,
  workspaceSlug,
  projectId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docId: number;
  title: string;
  assignees: DocAssignee[];
  workspaceSlug: string | undefined;
  projectId: number;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["doc", docId],
    queryFn: () => getSingleDoc(docId),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex h-[82vh] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="flex items-start justify-between gap-4 border-b px-6 py-5 pr-12">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-blue/15">
              <Image src={docsIcon} alt="" width={20} height={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">{title}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Document</span>
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
                    <span className="truncate">
                      {assignees.map((a) => a.username).join(", ")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {workspaceSlug && (
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link
                href={`/${workspaceSlug}/${projectId}/docs/${docId}`}
                onClick={() => onOpenChange(false)}
              >
                <SquareArrowOutUpRight className="size-3.5" /> Open
              </Link>
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="space-y-3 px-6 py-6">
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            </div>
          ) : (
            <DocContentViewer tabs={data?.document.content ?? null} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocPreviewModal;
