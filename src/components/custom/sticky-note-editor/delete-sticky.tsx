import { Button } from "@/src/components/shadcn/button";
import { Trash2 } from "lucide-react";
import { Editor } from "@tiptap/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStickyNote } from "@/src/lib/api/sticky-notes/services";
import { useAuth } from "@clerk/nextjs";
import { useWorkspaceStore } from "@/src/store/workspace";

interface DeleteStickyNoteButtonProps {
  editor: Editor | null;
  stickyNoteId: number;
}

const DeleteStickyNoteButton = ({
  editor,
  stickyNoteId,
}: DeleteStickyNoteButtonProps) => {
  const { userId } = useAuth();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteStickyNote,

    onSuccess: () => {
      // Refresh sticky notes list
      queryClient.invalidateQueries({
        queryKey: ["stickyNotes", userId, workspace?.id],
      });
    },
  });

  const handleDelete = () => {
    if (!stickyNoteId || mutation.isPending || !userId || !workspace?.id)
      return;
    mutation.mutate({ id: stickyNoteId, userId, workspaceId: workspace.id });
  };

  if (!editor) return null;

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleDelete}
      disabled={mutation.isPending}
      className="hover:text-destructive"
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
};

export default DeleteStickyNoteButton;
