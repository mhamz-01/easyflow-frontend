"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import TaskTableBody from "./task-table-body";
import TaskTableHeader from "./task-table-header";
import { useTaskStore } from "../../store/useTaskStore";
import { taskService } from "@/src/lib/api/tasks/service";
import TaskLoadingSkeleton from "../../components/task-loading-skeleton";
import TaskEmptyState from "../../components/task-empty-state";
import BulkDeleteBar from "../../components/bulk-delete-bar";

const TaskTable = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const { visibleColumns } = useTaskStore();
  const { project_id } = useParams();
  const [columnWidths, setColumnWidths] = useState<number[]>(
    Array(visibleColumns.length).fill(213),
  );
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["tasks", project_id],
      queryFn: ({ pageParam }) =>
        taskService.getTasksByProject(Number(project_id), {
          cursor: pageParam,
        }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasMore
          ? (lastPage.pagination.nextCursor ?? undefined)
          : undefined,
      enabled: !!project_id,
    });

  const tasks = data?.pages.flatMap((page) => page.tasks);

  const toggleSelect = useCallback((taskId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) =>
      tasks?.length && prev.size === tasks.length
        ? new Set()
        : new Set(tasks?.map((t) => t.id)),
    );
  }, [tasks]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      setHasHorizontalScroll(container.scrollWidth > container.clientWidth);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (isLoading) return <TaskLoadingSkeleton />;
  if (!tasks?.length) return <TaskEmptyState />;

  const allSelected = selectedIds.size === tasks.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div ref={containerRef} className="overflow-x-auto text-xs">
      {selectedIds.size > 0 && (
        <BulkDeleteBar
          selectedIds={Array.from(selectedIds)}
          onClear={() => setSelectedIds(new Set())}
        />
      )}
      <TaskTableHeader
        columnWidths={columnWidths}
        setColumnWidths={setColumnWidths}
        visibleColumns={visibleColumns.filter((c) => !c.isHidden)}
        hasHorizontalScroll={hasHorizontalScroll}
        allSelected={allSelected}
        someSelected={someSelected}
        onToggleSelectAll={toggleSelectAll}
      />
      <TaskTableBody
        tasks={tasks}
        columnWidths={columnWidths}
        hasHorizontalScroll={hasHorizontalScroll}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
      />

      {/* Sentinel — IntersectionObserver watches this to trigger next page */}
      <div ref={sentinelRef} className="h-px w-full" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4 text-xs text-muted-foreground">
          Loading more tasks...
        </div>
      )}
    </div>
  );
};

export default TaskTable;
