"use client";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import CreateItemModal from "@/src/components/modals/create-item-modal";
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
import { Ellipsis, Maximize, Users, X, ArrowLeft, Plus } from "lucide-react";
import { createdDocResponse, docsListResponse } from "@/src/types/documents";
import ShareDocModal from "@/src/components/modals/share-doc-modal";
import { useQuery } from "@tanstack/react-query";
import { getSingleDoc } from "@/src/lib/api/documents/services";

export function DocsHeader() {
  const { open } = useSidebar();
  const params = useParams<{ id?: string }>();
  const isEditorPage = !!params?.id;
  const workspace = useWorkspaceStore((s) => s.workspace);
  const project = useProjectStore((s) => s.project);
  const { userId } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
const docId = params?.id ? Number(params.id) : null;




const { data: docData } = useQuery({
  queryKey: ["doc", docId],
  queryFn: () => getSingleDoc(docId!),
  enabled: !!docId,
});

  const mutationDocs = useMutation({
    mutationFn: createDoc,
    onSuccess: (data: createdDocResponse) => {
      setIsOpen(false); // ✅ close modal on success
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
              isPrivate: data.createdDoc.isPrivate, 
            },
            ...(oldData.docs || []),
          ],
        }),
      );
    },
  });


  const handleCreate = (name: string, isPrivate:boolean) => {
    if (workspace?.id && project?.id && userId) {
      mutationDocs.mutate({
        workspaceId: workspace.id,
        projectId: project.id,
        createdBy: userId,
        documentName: name, 
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
                { label: "Docs", path: "" },
              ]}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="primary" disabled={mutationDocs.isPending}>
      {mutationDocs.isPending ? (
        <Spinner />
      ) : (
        <>
          <span className="max-sm:hidden">Create Document</span>
          <Plus size={18} className="inline sm:hidden" />
        </>
      )}
    </Button>
  </DialogTrigger>
  <CreateItemModal
    title="Create Document"
    description="Enter a name for your new document."
    label="Document Name"
    placeholder="e.g. Meeting Notes"
    buttonText="Create Document"
    isPending={mutationDocs.isPending}
    onSubmit={handleCreate}
  />
</Dialog>
        </div>
      </section>
    );
  }

  // ─── Editor Page Header ────────────────────────────────────────────────────
  return (
    <section className="flex items-center justify-between p-4 border-b bg-background/90 backdrop-blur-md shadow-sm gap-2">
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
              { label: "Docs", path: "" },
            ]}
          />
        </div>
      </div>

      {/* Center */}
      <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-tight truncate max-w-[30%] text-center">
        {project?.projectName ?? "Document"}
      </span>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border bg-muted/40 text-muted-foreground">
          <button className="hover:text-foreground transition-colors" title="Collaborators">
            <Users size={15} />
          </button>
          <span className="max-sm:hidden h-3.5 w-px bg-border" />
          <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
  <button
    onClick={() => setIsShareOpen(true)}
    className="max-sm:hidden hover:text-foreground transition-colors"
    title="Share"
  >
    <span className="text-xs font-medium">Share</span>
  </button>
  {isShareOpen && docId && (
    <ShareDocModal
      docId={docId}
      documentName={docData?.document.documentName ?? ""}
      existingAssignees={docData?.document.assignees ?? []}
      onClose={() => setIsShareOpen(false)}
    />
  )}
</Dialog>
          <span className="h-3.5 w-px bg-border" />
          <button className="hover:text-foreground transition-colors" title="More options">
            <Ellipsis size={15} />
          </button>
          <span className="max-sm:hidden h-3.5 w-px bg-border" />
          <button className="max-sm:hidden hover:text-foreground transition-colors" title="Fullscreen">
            <Maximize size={15} />
          </button>
        </div>

        {/* <Button
          onClick={handleCreate}
          variant="primary"
          size="sm"
          disabled={mutationDocs.isPending}
        >
          {mutationDocs.isPending ? (
            <Spinner />
          ) : (
            <>
              <span className="max-sm:hidden">New Document</span>
              <Plus size={16} className="inline sm:hidden" />
            </>
          )}
        </Button> */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="primary" disabled={mutationDocs.isPending}>
      {mutationDocs.isPending ? (
        <Spinner />
      ) : (
        <>
          <span className="max-sm:hidden">Create Document</span>
          <Plus size={18} className="inline sm:hidden" />
        </>
      )}
    </Button>
  </DialogTrigger>
  <CreateItemModal
    title="Create Document"
    description="Enter a name for your new document."
    label="Document Name"
    placeholder="e.g. Meeting Notes"
    buttonText="Create Document"
    isPending={mutationDocs.isPending}
    onSubmit={handleCreate}
  />
</Dialog>
      </div>
    </section>
  );
}