"use client";
import { Button } from "@/src/components/shadcn/button";
import { createStickyNote } from "@/src/lib/api/sticky-notes/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { ApiError } from "@/src/types";
import { CreateStickyNoteResponse } from "@/src/types/stickyNotes";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "../../shadcn/spinner";

const AddStickyNoteButton = () => {
  const { userId } = useAuth();

  const workspace = useWorkspaceStore((s) => s.workspace);

  const queryClient = useQueryClient();

  // create sticky note (Optimistic UI update)
  const mutation = useMutation<
    CreateStickyNoteResponse,
    ApiError,
    { userId: string; workspaceId: number }
  >({
    mutationFn: createStickyNote,

    onError: (err) => {
      const message = err.response?.data?.message ?? "Something went wrong";
      toast.error(message);
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["stickyNotes", vars.userId, vars.workspaceId],
      });
    },
  });

  const handleAddStickyNote = () => {
    if (userId && workspace?.id) {
      mutation.mutate({ userId, workspaceId: workspace.id });
    }
  };

  return (
    <Button
      onClick={handleAddStickyNote}
      variant={"ghost"}
      className="text-primary-blue hover:text-primary-blue/90"
    >
      {mutation.isPending ? (
        <Spinner />
      ) : (
        <>
          <Plus />
          Add Sticky Note
        </>
      )}
    </Button>
  );
};

export default AddStickyNoteButton;
