import { useDeleteTask } from "@/src/hooks/tasks";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/src/components/shadcn/alert-dialog";
import AlertDialogContentModal from "@/src/components/modals/alert-dialog-content";

const DeleteTaskButton = ({
  taskId,
  taskName,
}: {
  taskId: number;
  taskName: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeleteTask({
    onSuccess: () => setIsOpen(false),
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
      <button
  onClick={(e) => {
    e.stopPropagation();
    setIsOpen(true);
  }}
  disabled={isPending}
  aria-label="Delete task"
  className="
    opacity-0 group-hover:opacity-100
    p-1.5 ml-2 rounded cursor-pointer
    text-red-400 hover:text-red-600
    disabled:opacity-40 disabled:cursor-not-allowed
  "
>
  <Trash2 size={15} />
</button>
      </AlertDialogTrigger>

      <AlertDialogContentModal
  body={`This will permanently delete the task "${taskName}". This action cannot be undone.`}
  loader={isPending}
  onContinue={() => mutate(taskId)}
/>
    </AlertDialog>
  );
};

export default DeleteTaskButton;