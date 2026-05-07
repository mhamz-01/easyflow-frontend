import { TaskViewList } from "@/src/types/tasks";

const STATE_ORDER: Record<string, number> = {
  todo: 0,
  "in-progress": 1,
  done: 2,
};

const PRIORITY_ORDER: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export const COMPARATORS: Record<
  string,
  (a: TaskViewList, b: TaskViewList) => number
> = {
  state: (a, b) => {
    return (STATE_ORDER[a.state] ?? 999) - (STATE_ORDER[b.state] ?? 999);
  },

  priority: (a, b) => {
    return (
      (PRIORITY_ORDER[a.priority] ?? 999) - (PRIORITY_ORDER[b.priority] ?? 999)
    );
  },

  dueDate: (a, b) => {
    const ta = a.dueDate ? Date.parse(a.dueDate) : Infinity;
    const tb = b.dueDate ? Date.parse(b.dueDate) : Infinity;
    return ta - tb;
  },
};
