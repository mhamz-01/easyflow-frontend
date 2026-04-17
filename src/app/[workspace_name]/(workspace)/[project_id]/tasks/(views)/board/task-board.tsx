import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import TaskBoardSkeleton from "../../components/task-board-skeleton";
import { GroupByField, useBoardGroups } from "./useBoardGroups";
import { Task, TaskViewList } from "@/src/types/tasks";
import SelectAssignees from "@/src/components/dropdown-select/select-assignees";
import { useParams } from "next/navigation";

export const TaskCard = ({ task }: { task: TaskViewList }) => (
  <div className="mx-2 mb-2 rounded-md border bg-background p-3 text-xs shadow-sm">
    <p className="font-medium">{task.name}</p>
    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
      <SelectAssignees
        selectedIds={task.assignees.map((assignee) => assignee.id)}
        onSelect={(selectedIds) => {
          console.log("selected id", selectedIds);
          // mutate({
          //   taskId: task.id,
          //   payload: { assigneeIds: selectedIds },
          // });
        }}
      />
    </div>
  </div>
);
const BoardColumn = ({
  title,
  tasks,
}: {
  title: string;
  tasks: TaskViewList[];
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 112, // estimate card height
    overscan: 5,
  });

  return (
    <div className="flex w-64 flex-shrink-0 flex-col rounded-lg bg-muted/50">
      <div className="p-3 font-medium text-sm">
        {title} · {tasks.length}
      </div>
      <div
        ref={parentRef}
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        <div
          style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((item) => (
            <div
              key={item.key}
              style={{ position: "absolute", top: item.start, width: "100%" }}
            >
              <TaskCard task={tasks[item.index]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const { project_id } = useParams();
  const [groupByField, setGroupByField] = useState<GroupByField>("state");
  const { groups, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useBoardGroups(Number(project_id), groupByField);

  // Keep loading more pages while board is visible
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <TaskBoardSkeleton />;

  return (
    <div className="flex h-full flex-col gap-3">
      {/* <GroupBySelector value={groupByField} onChange={setGroupByField} /> */}
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
