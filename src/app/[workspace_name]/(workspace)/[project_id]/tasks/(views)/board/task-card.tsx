import SelectAssignees from "@/src/components/dropdown-select/select-assignees";
import { TaskViewList } from "@/src/types/tasks";
import { CalendarIcon, Lock } from "lucide-react";
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

function TaskCard({
  task,
  accent = "bg-muted-foreground/30",
}: {
  task: TaskViewList;
  accent?: string;
}) {
  const { setIsOpen } = useTaskStore();
  const { mutate: updateTask } = useUpdateTask();

  const priority =
    priorityConfig[task.priority.toLowerCase() as keyof typeof priorityConfig];

  const isOverdue =
    task.state !== "done" &&
    task.dueDate &&
    new Date(task.dueDate).getTime() < Date.now();

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    updateTask({
      taskId: task.id,
      payload: { dueDate: date },
    });
  };

  return (
    <div className="flex overflow-hidden rounded-xl border bg-background text-xs shadow-sm transition-shadow hover:shadow-md">
      {/* Column-colored accent bar for quick visual scanning */}
      <span className={`w-1 shrink-0 ${accent}`} />

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
        {/* Header — name + priority */}
        <div
          onClick={() => setIsOpen(true, task.id)}
          className="flex items-start justify-between gap-2 cursor-pointer group"
        >
          <p className="text-sm font-medium leading-snug group-hover:text-primary-blue flex items-center gap-1.5">
            {task.isPrivate && (
              <span title="Private task">
                <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />
              </span>
            )}
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

        {/* Footer — due date + assignees, kept to one tidy row */}
        <div className="flex items-center justify-between gap-2">
          <SelectDate
            value={task.dueDate ? new Date(task.dueDate) : undefined}
            onChange={handleDateChange}
            renderTrigger={({ value }) => (
              <span className="cursor-pointer inline-block dark:bg-transparent hover:dark:bg-transparent border-0 p-0">
                {value instanceof Date ? (
                  <div
                    className={`flex items-center gap-1.5 ${
                      isOverdue ? "text-[#FF6B4A]" : "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {formatDate(value, { year: undefined, month: "short", day: "2-digit" })}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-muted-foreground/60">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>No date</span>
                  </div>
                )}
              </span>
            )}
          />

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
