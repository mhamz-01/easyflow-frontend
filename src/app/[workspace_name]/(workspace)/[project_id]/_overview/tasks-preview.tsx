"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import tasksIcon from "@/public/icons/tasks.svg";
import Avatar from "@/src/components/custom/avatar";
import { Badge } from "@/src/components/shadcn/badge";
import { formatDate } from "@/src/lib/utils";
import { useTaskStore } from "../tasks/store/useTaskStore";
import { UpcomingTask } from "./task-analytics";
import Panel from "./panel";

const priorityDot: Record<string, string> = {
  urgent: "#E24B4A",
  high: "#E24B4A",
  medium: "#BA7517",
  low: "#378ADD",
};

const TasksPreview = ({
  basePath,
  total,
  overdueCount,
  upcoming,
  isLoading,
}: {
  basePath: string;
  total: number;
  overdueCount: number;
  upcoming: UpcomingTask[];
  isLoading: boolean;
}) => {
  const router = useRouter();

  const openTask = (taskId: number) => {
    useTaskStore.getState().setIsOpen(true, taskId);
    router.push(`${basePath}/tasks`);
  };

  return (
    <Panel
      icon={<Image src={tasksIcon} alt="" width={16} height={16} />}
      title="Tasks"
      meta={
        !isLoading && (
          <Badge variant="secondary" className="font-normal">
            {total}
          </Badge>
        )
      }
      href={`${basePath}/tasks`}
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : total === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-10 text-center">
          <p className="text-sm font-medium text-gray-400">No tasks yet</p>
          <p className="text-xs text-gray-600">Create a task to start tracking work here.</p>
        </div>
      ) : upcoming.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-10 text-center">
          <CheckCircle2 className="size-6 text-primary-green" />
          <p className="text-sm font-medium text-gray-400">All caught up</p>
          <p className="text-xs text-gray-600">Every task is done.</p>
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {upcoming.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => openTask(task.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: priorityDot[task.priority.toLowerCase()] ?? "#6E6E6E" }}
                  />
                  <span className="truncate text-sm">{task.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {task.dueDate && (
                    <span className={`text-xs ${task.isOverdue ? "text-[#FF6B4A]" : "text-gray-500"}`}>
                      {formatDate(task.dueDate, { year: undefined, month: "short", day: "2-digit" })}
                    </span>
                  )}
                  {task.assignees[0] && (
                    <Avatar src={task.assignees[0].imageUrl} width={20} height={20} />
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && overdueCount > 0 && (
        <div className="border-t border-white/[0.06] px-4 py-2 text-xs text-[#FF6B4A]">
          {overdueCount} task{overdueCount === 1 ? "" : "s"} overdue
        </div>
      )}
    </Panel>
  );
};

export default TasksPreview;
