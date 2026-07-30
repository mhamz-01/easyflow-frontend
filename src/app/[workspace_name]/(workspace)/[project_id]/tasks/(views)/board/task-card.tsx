import SelectAssignees from "@/src/components/dropdown-select/select-assignees";
import { TaskViewList } from "@/src/types/tasks";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import SelectDate from "@/src/components/select-date/SelectDate";
import { formatDate } from "@/src/lib/utils";
import { useUpdateTask } from "@/src/hooks/tasks";

const priorityConfig = {
  urgent: { bg: "#FAECE7", color: "#993C1D", dot: "#D85A30" },
  high: { bg: "#FAECE7", color: "#993C1D", dot: "#E24B4A" },
  medium: { bg: "#FAEEDA", color: "#854F0B", dot: "#BA7517" },
  low: { bg: "#E6F1FB", color: "#185FA5", dot: "#378ADD" },
};

const stateConfig: Record<string, { bg: string; color: string }> = {
  backlog: {
    bg: "var(--muted)",
    color: "var(--muted-foreground)",
  },
  todo: { bg: "#E6F1FB", color: "#185FA5" },
  "in progress": { bg: "#EAF3DE", color: "#3B6D11" },
  "in review": { bg: "#EEEDFE", color: "#534AB7" },
  done: { bg: "#EAF3DE", color: "#27500A" },
};

function TaskCard({ task }: { task: TaskViewList }) {
  const { setIsOpen } = useTaskStore();
  const { mutate: updateTask } = useUpdateTask();

  const priority =
    priorityConfig[task.priority.toLowerCase() as keyof typeof priorityConfig];
  const state = stateConfig[task.state.toLowerCase()] ?? stateConfig["backlog"];

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    updateTask({
      taskId: task.id,
      payload: { dueDate: date },
    });
  };

  return (
    <div className="mx-2 mb-2 rounded-lg border bg-background p-3 text-xs shadow-sm">
      {/* Header — name + priority */}
      <div
        onClick={() => setIsOpen(true, task.id)}
        className="flex items-start justify-between gap-2 cursor-pointer group"
      >
        <p className="text-sm font-medium leading-snug group-hover:text-primary-blue">
          {task.name}
        </p>
        {priority && (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: priority.bg, color: priority.color }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: priority.dot }}
            />
            {task.priority}
          </span>
        )}
      </div>

      <div className="my-2 h-px bg-border" />

      {/* Meta rows */}
      <div className="flex flex-col gap-1.5">
        <SelectDate
          value={task.dueDate ? new Date(task.dueDate) : undefined}
          onChange={handleDateChange}
          renderTrigger={({ value }) => (
            <span className="cursor-pointer inline-block min-w-20 dark:bg-transparent hover:dark:bg-transparent border-0 p-0">
              {value instanceof Date ? (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {formatDate(value)}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>Enter due date</span>
                </div>
              )}
            </span>
          )}
        />

        {/* State */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: state.bg, color: state.color }}
          >
            {task.state}
          </span>
        </div>

        {/* Assignees */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <SelectAssignees
            selectedIds={task.assignees.map((a) => a.id)}
            onSelect={(selectedIds) => {
              updateTask({ taskId: task.id, payload: { assigneeIds: selectedIds } });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TaskCard;