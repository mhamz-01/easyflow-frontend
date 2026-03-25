import { Button } from "@/src/components/shadcn/button";
import { ClipboardList } from "lucide-react";

const TaskEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-100 py-16 px-4">
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6">
        <ClipboardList className="w-8 h-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
        No tasks yet
      </h3>

      {/* Body */}
      <p className="text-sm text-muted-foreground max-w-xs mb-8">
        You don't have any tasks yet. Create your first task to start tracking
        your work and stay organized.
      </p>

      {/* CTA Button */}
      <Button
        variant={"primary"}
        onClick={() => console.log("Create task clicked")}
      >
        Create Task
      </Button>
    </div>
  );
};

export default TaskEmptyState;
