import TaskTableSkeleton from "./task-table-skeleton";
import TaskBoardSkeleton from "./task-board-skeleton";
import { useTaskStore } from "../store/useTaskStore";

const TaskLoadingSkeleton = () => {
  const { view } = useTaskStore(); // "table" | "board"

  return view === "board" ? <TaskBoardSkeleton /> : <TaskTableSkeleton />;
};

export default TaskLoadingSkeleton;
