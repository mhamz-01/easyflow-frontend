import TaskSelectPriority from "./task-select-priority";
import TaskSelectStatus from "./task-select-status";

export default function TaskDropdowns() {
  return (
    <div className="flex gap-3">
      <TaskSelectStatus />
      <TaskSelectPriority />
    </div>
  );
}
