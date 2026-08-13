"use client";

import { TasksHeader } from "./header";
import TaskManagerHeader from "./task-manager-header";
import TaskLoadingSkeleton from "./components/task-loading-skeleton";

// Shown the instant the sidebar link is clicked, before this route's own
// JS has downloaded/hydrated — without it there's no fallback here (the
// workspace-level loading.tsx intentionally renders nothing) so the click
// looked like it did nothing until the whole page popped in. Mirrors
// exactly what TaskManager renders while its own query is loading
// (TaskManagerHeader has no data dependency — it's pure zustand UI state —
// and TaskLoadingSkeleton is the same component task-table/task-board show
// during isLoading), so there's no visual jump once the real page mounts.
export default function Loading() {
  return (
    <section className="px-4">
      <TasksHeader />
      <TaskManagerHeader />
      <TaskLoadingSkeleton />
    </section>
  );
}
