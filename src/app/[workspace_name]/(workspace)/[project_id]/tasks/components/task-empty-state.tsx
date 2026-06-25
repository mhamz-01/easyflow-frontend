import { useState } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { Button } from "@/src/components/shadcn/button";
import { ClipboardList } from "lucide-react";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import CreateTaskModal from "@/src/components/modals/create-task";

const TaskEmptyState = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isCreating = useIsMutating({ mutationKey: ["createTask"] }) > 0;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-100 py-16 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6">
        <ClipboardList className="w-8 h-8 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
        No tasks yet
      </h3>

      <p className="text-sm text-muted-foreground max-w-xs mb-8">
        You don't have any tasks yet. Create your first task to start tracking
        your work and stay organized.
      </p>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button variant={"primary"} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Task"}
          </Button>
        </DialogTrigger>
        <CreateTaskModal onClose={() => setIsCreateOpen(false)} />
      </Dialog>
    </div>
  );
};

export default TaskEmptyState;