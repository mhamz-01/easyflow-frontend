import { useEffect } from "react";
import TaskBoardSkeleton from "../../components/task-board-skeleton";
import { useBoardGroups } from "./useBoardGroups";
import { useParams } from "next/navigation";
import BoardColumn from "./board-column";
import { useTaskStore } from "../../store/useTaskStore";

const TaskBoard = () => {
  const { project_id } = useParams();
  const { boardGroupBy } = useTaskStore();
  const { groups, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useBoardGroups(Number(project_id), boardGroupBy);

  // Keep loading more pages while board is visible
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <TaskBoardSkeleton />;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex gap-3 overflow-x-auto pb-4">
        {groups.map(({ key, tasks }) => (
          <BoardColumn key={key} title={key} tasks={tasks} />
        ))}
      </div>
      {isFetchingNextPage && (
        <div className="text-center text-xs text-muted-foreground py-2">
          Loading more…
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
