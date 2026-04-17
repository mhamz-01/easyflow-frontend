// useBoardGroups.ts
import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { taskService } from "@/src/lib/api/tasks/service";
import { groupBy } from "lodash";
import { TaskViewList } from "@/src/types/tasks";

export type GroupByField = "state" | "assignees" | "priority";

export function useBoardGroups(projectId: number, groupByField: GroupByField) {
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

    if (groupByField === "assignees") {
      // A task with multiple assignees appears in each of their columns
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

    // All other fields are flat strings — group directly
    const grouped = groupBy(tasks, (t) => t[groupByField] ?? "none");
    return Object.entries(grouped).map(([key, tasks]) => ({ key, tasks }));
  }, [data, groupByField]); // ← re-groups instantly, no fetch

  return { groups, ...rest };
}
