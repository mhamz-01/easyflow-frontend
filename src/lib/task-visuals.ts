// Shared color config for task priority/state badges — mirrors the map in
// tasks/(views)/board/task-card.tsx so every place a task is rendered
// (board, chat cards, chat preview modal) looks consistent.

export const TASK_PRIORITY_STYLES: Record<
  string,
  { bg: string; color: string; dot: string }
> = {
  urgent: { bg: "#FAECE7", color: "#993C1D", dot: "#D85A30" },
  high: { bg: "#FAECE7", color: "#993C1D", dot: "#E24B4A" },
  medium: { bg: "#FAEEDA", color: "#854F0B", dot: "#BA7517" },
  low: { bg: "#E6F1FB", color: "#185FA5", dot: "#378ADD" },
};

export const TASK_STATE_STYLES: Record<string, { bg: string; color: string }> = {
  backlog: { bg: "var(--muted)", color: "var(--muted-foreground)" },
  todo: { bg: "#E6F1FB", color: "#185FA5" },
  "in progress": { bg: "#EAF3DE", color: "#3B6D11" },
  "in review": { bg: "#EEEDFE", color: "#534AB7" },
  done: { bg: "#EAF3DE", color: "#27500A" },
};

export const getPriorityStyle = (priority?: string | null) =>
  TASK_PRIORITY_STYLES[(priority ?? "").toLowerCase()] ?? TASK_PRIORITY_STYLES.medium;

export const getStateStyle = (state?: string | null) =>
  TASK_STATE_STYLES[(state ?? "").toLowerCase().replace(/-/g, " ")] ??
  TASK_STATE_STYLES.backlog;
