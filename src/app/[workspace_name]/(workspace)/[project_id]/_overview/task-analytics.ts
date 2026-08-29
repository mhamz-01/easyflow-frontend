import { TaskViewList } from "@/src/types/tasks";

export const TASK_STATES = ["todo", "in progress", "done"] as const;
export type TaskStateKey = (typeof TASK_STATES)[number];

export type UpcomingTask = TaskViewList & { isOverdue: boolean };

export type TaskAnalytics = {
  total: number;
  counts: Record<TaskStateKey, number>;
  completionRate: number;
  overdueCount: number;
  // Not-done tasks, soonest due date first (tasks with no due date sort last).
  upcoming: UpcomingTask[];
};

export const computeTaskAnalytics = (tasks: TaskViewList[]): TaskAnalytics => {
  const counts: Record<TaskStateKey, number> = { todo: 0, "in progress": 0, done: 0 };
  const now = Date.now();
  let overdueCount = 0;

  for (const task of tasks) {
    if (task.state in counts) counts[task.state as TaskStateKey]++;
    if (
      task.state !== "done" &&
      task.dueDate &&
      new Date(task.dueDate).getTime() < now
    ) {
      overdueCount++;
    }
  }

  const total = tasks.length;
  const completionRate = total ? Math.round((counts.done / total) * 100) : 0;

  const upcoming: UpcomingTask[] = [...tasks]
    .filter((t) => t.state !== "done")
    .sort((a, b) => {
      const ta = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const tb = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ta - tb;
    })
    .slice(0, 5)
    .map((task) => ({
      ...task,
      isOverdue: Boolean(task.dueDate && new Date(task.dueDate).getTime() < now),
    }));

  return { total, counts, completionRate, overdueCount, upcoming };
};
