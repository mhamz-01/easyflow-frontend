import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/shadcn/button";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/src/components/shadcn/alert-dialog";
import AlertDialogContentModal from "@/src/components/modals/alert-dialog-content";
import { taskService } from "@/src/lib/api/tasks/service";
import { taskKeys } from "@/src/hooks/tasks";

const BulkDeleteBar = ({
  selectedIds,
  onClear,
}: {
  selectedIds: number[];
  onClear: () => void;
}) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => taskService.deleteTask(id)));
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
      toast.success(
        `${selectedIds.length} task${selectedIds.length > 1 ? "s" : ""} deleted`,
      );
      onClear();
      setIsOpen(false);
    } catch {
      toast.error("Failed to delete some tasks");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-muted px-4 py-2 text-sm">
      <span>{selectedIds.length} selected</span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4" />
          Clear
        </Button>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContentModal
            body={`This will permanently delete ${selectedIds.length} task${selectedIds.length > 1 ? "s" : ""}. This action cannot be undone.`}
            loader={isDeleting}
            onContinue={handleDelete}
          />
        </AlertDialog>
      </div>
    </div>
  );
};

export default BulkDeleteBar;
