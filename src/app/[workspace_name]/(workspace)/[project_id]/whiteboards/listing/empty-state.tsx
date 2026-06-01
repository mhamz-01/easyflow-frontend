"use client";

import { useState } from "react";
import { Button } from "@/src/components/shadcn/button";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import CreateItemModal from "@/src/components/modals/create-item-modal";
import { createWhiteboard } from "@/src/lib/api/whiteboards/services";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";
import { createdWhiteboardResponse, whiteboardsListResponse } from "@/src/types/whiteboard";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const WhiteboardListingEmptyState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const projectId = useProjectStore((s) => s.project?.id);
  const { userId } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createWhiteboard,
    onSuccess: (data: createdWhiteboardResponse) => {
      setIsOpen(false);
      router.push(`whiteboards/${data.createdDoc.id}`);
      queryClient.setQueryData(
        ["whiteboards", workspaceId, projectId],
        (oldData: Partial<whiteboardsListResponse>) => ({
          ...oldData,
          whiteboards: [
            {
              id: data.createdDoc.id,
              whiteboardName: data.createdDoc.whiteboardName,
              assignees: data.createdDoc.assignees,
              isPrivate: data.createdDoc.isPrivate, // ✅
            },
            ...(oldData.whiteboards || []),
          ],
        }),
      );
    },
  });

  const handleCreate = (name: string, isPrivate: boolean) => {
    if (workspaceId && projectId && userId) {
      mutation.mutate({
        workspaceId,
        projectId,
        createdBy: userId,
        whiteboardName: name,  // ✅
        isPrivate,             // ✅
      });
    }
  };

  return (
    <div className="p-6 border rounded-md space-y-1">
      <h1 className="text-h1 font-medium">No Whiteboards created yet.</h1>
      <p className="text-sm mb-4">
        Create your first whiteboard and share it with your team
      </p>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="primary">Create New Whiteboard</Button>
        </DialogTrigger>
        <CreateItemModal
          title="Create Whiteboard"
          description="Enter a name for your new whiteboard."
          label="Whiteboard Name"
          placeholder="e.g. System Design"
          buttonText="Create Whiteboard"
          isPending={mutation.isPending}
          onSubmit={handleCreate}
        />
      </Dialog>
    </div>
  );
};

export default WhiteboardListingEmptyState;