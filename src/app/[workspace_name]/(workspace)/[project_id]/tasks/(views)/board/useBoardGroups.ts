import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { taskService } from "@/src/lib/api/tasks/service";
import { groupBy } from "lodash";
import { TaskViewList } from "@/src/types/tasks";

const STATE_ORDER = ["todo", "in progress", "done"];
const PRIORITY_ORDER = ["urgent", "high", "medium", "low"];

export function useBoardGroups(projectId: number, groupByField: string) {
  const { data, ...rest } = useInfiniteQuery({
    queryKey: ["tasks", projectId], // ← same key as table view
    queryFn: ({ pageParam }) =>
      taskService.getTasksByProject(projectId, { cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last) =>
      last.pagination.hasMore ? last.pagination.nextCursor : undefined,
    enabled: !!projectId,
    staleTime: 30_000, // don't re-fetch when switching views
  });

  const groups = useMemo(() => {
    const tasks = data?.pages.flatMap((p) => p.tasks) ?? [];

    if (groupByField === "assignee") {
      const grouped: Record<string, TaskViewList[]> = {};
      for (const task of tasks) {
        if (!task.assignees.length) {
          (grouped["unassigned"] ??= []).push(task);
        } else {
          for (const assignee of task.assignees) {
            (grouped[assignee.username] ??= []).push(task);
          }
        }
      }
      return Object.entries(grouped).map(([key, tasks]) => ({ key, tasks }));
    }

    type TaskGroupByField = keyof TaskViewList | "none";

    const grouped = groupBy(tasks, (t) => {
      return (groupByField as TaskGroupByField) === "none"
        ? t["state"]
        : t[groupByField as keyof TaskViewList];
    });

    // ✅ enforce stable column order
    if (groupByField === "none" || groupByField === "state") {
      return STATE_ORDER.map((key) => ({
        key,
        tasks: grouped[key] ?? [],
      }));
    }

    if (groupByField === "priority") {
      // always show every priority level, ordered by severity, so an empty
      // level is still a valid drop target for the board's drag-and-drop
      return PRIORITY_ORDER.map((key) => ({
        key,
        tasks: grouped[key] ?? [],
      }));
    }

    // fallback for other grouping types
    return Object.entries(grouped).map(([key, tasks]) => ({ key, tasks }));
  }, [data, groupByField]);

  return { groups, ...rest };
}
