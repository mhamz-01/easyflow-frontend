"use client";
import { useState } from "react";
import { Button } from "../../../../../components/shadcn/button";
import {
  SidebarTrigger,
  useSidebar,
} from "../../../../../components/shadcn/sidebar";
import Breadcrumbs from "../../../../../components/custom/breadcrumbs";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useAuth } from "@clerk/nextjs";
import { createDoc } from "@/src/lib/api/documents/services";
import { Spinner } from "../../../../../components/shadcn/spinner";
import { Ellipsis, Maximize, Users, X, ArrowLeft, GripHorizontal } from "lucide-react";
import { createdDocResponse, docsListResponse } from "@/src/types/documents";

export function DocsHeader() {
  const { open } = useSidebar();
  const params = useParams<{ id?: string }>();
  const isEditorPage = !!params?.id;
  const workspace = useWorkspaceStore((s) => s.workspace);
  const project = useProjectStore((s) => s.project);
  const { userId } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showBar, setShowBar] = useState(false);

  const mutationDocs = useMutation({
    mutationFn: createDoc,
    onSuccess: (data: createdDocResponse) => {
      router.push(`docs/${data.createdDoc.id}`);
      queryClient.setQueryData(
        ["docs", workspace?.id, project?.id],
        (oldData: Partial<docsListResponse>) => ({
          ...oldData,
          docs: [
            {
              id: data.createdDoc.id,
              documentName: data.createdDoc.documentName,
              assignees: data.createdDoc.assignees,
            },
            ...(oldData.docs || []),
          ],
        }),
      );
    },
  });

  const handleCreate = () => {
    if (workspace?.id && project?.id && userId) {
      mutationDocs.mutate({
        workspaceId: workspace?.id,
        projectId: project?.id,
        createdBy: userId,
      });
    }
  };

  // ─── Listing Page Header ───────────────────────────────────────────────────
  if (!isEditorPage) {
    return (
      <section className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {<SidebarTrigger className={!open ? "" : "md:hidden"} />}
          <Breadcrumbs
            items={[
              { label: "Home", path: `/${workspace?.workspaceSlug ?? "/"}` },
              { label: project?.projectName, path: "#" },
              { label: "Docs", path: "" },
            ]}
          />
        </div>
        <div className="flex items-center gap-5 border-2 overflow-hidden p-3 rounded-2xl">
          <Users size={18} />
          <span>share</span>
          <Ellipsis size={18} />
          <Maximize size={18} />
          <X size={18} />
        </div>
        <Button
          onClick={handleCreate}
          variant="primary"
          className="relative"
          disabled={mutationDocs.isPending}
        >
          <span className={mutationDocs.isPending ? "invisible" : "visible"}>
            Create Document
          </span>
          {mutationDocs.isPending && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Spinner />
            </span>
          )}
        </Button>
      </section>
    );
  }

  // ─── Editor Page — Fixed Header ───────────────────────────────────────────
  return (
    <section className="flex items-center justify-between p-4 border-b bg-background/90 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-2">
        <Button onClick={() => router.back()} variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <span className="h-4 w-px bg-border" />
        <SidebarTrigger className={!open ? "" : "md:hidden"} />
        <Breadcrumbs
          items={[
            { label: "Home", path: `/${workspace?.workspaceSlug ?? "/"}` },
            { label: project?.projectName, path: "#" },
            { label: "Docs", path: "" },
          ]}
        />
      </div>

      <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-tight">
        {project?.projectName ?? "Document"}
      </span>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl border bg-muted/40 text-muted-foreground">
          <button className="hover:text-foreground transition-colors" title="Collaborators"><Users size={15} /></button>
          <span className="h-3.5 w-px bg-border" />
          <button className="hover:text-foreground transition-colors" title="Share"><span className="text-xs font-medium">Share</span></button>
          <span className="h-3.5 w-px bg-border" />
          <button className="hover:text-foreground transition-colors" title="More options"><Ellipsis size={15} /></button>
          <span className="h-3.5 w-px bg-border" />
          <button className="hover:text-foreground transition-colors" title="Fullscreen"><Maximize size={15} /></button>
        </div>
        <Button onClick={handleCreate} variant="primary" size="sm" className="relative" disabled={mutationDocs.isPending}>
          <span className={mutationDocs.isPending ? "invisible" : "visible"}>New Document</span>
          {mutationDocs.isPending && (
            <span className="absolute inset-0 flex items-center justify-center"><Spinner /></span>
          )}
        </Button>
      </div>
    </section>
  );
}