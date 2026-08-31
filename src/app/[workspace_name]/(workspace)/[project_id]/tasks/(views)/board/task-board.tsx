"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import TaskBoardSkeleton from "../../components/task-board-skeleton";
import { useBoardGroups } from "./useBoardGroups";
import BoardColumn from "./board-column";
import TaskCard from "./task-card";
import { useTaskStore } from "../../store/useTaskStore";
import { useUpdateTask } from "@/src/hooks/tasks";
import type { TaskViewList } from "@/src/types/tasks";

type TasksPage = {
  tasks: TaskViewList[];
  pagination: { nextCursor: number | null; hasMore: boolean; limit: number };
};

// Only groupings that map 1:1 onto a single task field can be dragged
// between columns — "assignee" columns can share a task, so a drag there
// would be ambiguous about which assignment to change.
const DRAGGABLE_GROUPINGS = new Set(["none", "state", "priority"]);

const TaskBoard = () => {
  const { project_id } = useParams();
  const projectId = Number(project_id);
  const { boardGroupBy } = useTaskStore();
  const { groups, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useBoardGroups(projectId, boardGroupBy);
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<TaskViewList | null>(null);

  const isDraggable = DRAGGABLE_GROUPINGS.has(boardGroupBy);
  const moveField = boardGroupBy === "priority" ? "priority" : "state";

  const { mutate: updateTask } = useUpdateTask({
    // the optimistic move below can end up wrong if the request fails —
    // resync from the server instead of leaving a stale card in place
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  // Keep loading more pages while board is visible
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const tasksById = useMemo(() => {
    const map = new Map<number, TaskViewList>();
    for (const group of groups) for (const task of group.tasks) map.set(task.id, task);
    return map;
  }, [groups]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasksById.get(Number(event.active.id)) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const destination = String(over.id);
    const source = active.data.current?.columnKey as string | undefined;
    if (!destination || destination === source) return;

    // move the card immediately; the mutation reconciles with the server
    // in the background (and rolls back via invalidate if it fails)
    queryClient.setQueryData<InfiniteData<TasksPage>>(["tasks", projectId], (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          tasks: page.tasks.map((t) =>
            t.id === taskId ? { ...t, [moveField]: destination } : t,
          ),
        })),
      };
    });

    updateTask({ taskId, payload: { [moveField]: destination } });
  };

  if (isLoading) return <TaskBoardSkeleton />;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex h-full flex-col gap-3">
        <div className="flex flex-1 items-start gap-4 overflow-x-auto pb-4">
          {groups.map(({ key, tasks }, index) => (
            <BoardColumn
              key={key}
              groupBy={boardGroupBy}
              groupKey={key}
              tasks={tasks}
              draggable={isDraggable}
              index={index}
            />
          ))}
        </div>
        {isFetchingNextPage && (
          <div className="text-center text-xs text-muted-foreground py-2">
            Loading more…
          </div>
        )}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="w-72 rotate-2 opacity-95">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;
