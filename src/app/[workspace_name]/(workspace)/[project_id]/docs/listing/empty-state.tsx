"use client";

import { useState } from "react";
import { Button } from "@/src/components/shadcn/button";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import CreateItemModal from "@/src/components/modals/create-item-modal";
import { createDoc } from "@/src/lib/api/documents/services";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";
import { createdDocResponse, docsListResponse } from "@/src/types/documents";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const DocsListingEmptyState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const projectId = useProjectStore((s) => s.project?.id);
  const { userId } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createDoc,
    onSuccess: (data: createdDocResponse) => {
      setIsOpen(false);
      router.push(`docs/${data.createdDoc.id}`);
      queryClient.setQueryData(
        ["docs", workspaceId, projectId],
        (oldData: Partial<docsListResponse>) => ({
          ...oldData,
          docs: [
            {
              id: data.createdDoc.id,
              documentName: data.createdDoc.documentName,
              assignees: data.createdDoc.assignees,
              isPrivate: data.createdDoc.isPrivate, // ✅
              defaultAccess: data.createdDoc.defaultAccess,
            },
            ...(oldData.docs || []),
          ],
        }),
      );
    },
  });

  const handleCreate = (
    name: string,
    isPrivate: boolean,
    defaultAccess?: "view" | "edit",
  ) => {
    if (workspaceId && projectId && userId) {
      mutation.mutate({
        workspaceId,
        projectId,
        createdBy: userId,
        documentName: name,    // ✅
        isPrivate,             // ✅
        defaultAccess,
      });
    }
  };

  return (
    <div className="p-6 border rounded-md space-y-1">
      <h1 className="text-h1 font-medium">No documents created yet.</h1>
      <p className="text-sm mb-4">
        Create your first document and share it with your team
      </p>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="primary">Create New Doc</Button>
        </DialogTrigger>
        <CreateItemModal
          title="Create Document"
          description="Enter a name for your new document."
          label="Document Name"
          placeholder="e.g. Meeting Notes"
          buttonText="Create Document"
          isPending={mutation.isPending}
          onSubmit={handleCreate}
          showDefaultAccessOption
        />
      </Dialog>
    </div>
  );
};

export default DocsListingEmptyState;