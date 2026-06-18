import TaskSelectAssignees from "./task-select-assignees";
import TaskSelectDate from "./task-select-date";
import TaskSelectPriority from "./task-select-priority";
import TaskSelectStatus from "./task-select-state";
import TaskSelectWhiteboard from "./task-select-whiteboard";

export default function TaskSelect() {
  return (
    <div className="flex flex-wrap gap-4">
      <TaskSelectStatus />
      <TaskSelectPriority />
      <TaskSelectAssignees />
      <TaskSelectDate />
    </div>
  );
}
