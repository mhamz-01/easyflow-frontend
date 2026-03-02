"use client";

import TaskBoard from "./(views)/board/task-board";
import TaskTable from "./(views)/table/task-table";
import { useTaskStore } from "./store/useTaskStore";

const TaskManagerBody = () => {
  const view = useTaskStore((state) => state.view);

  if (view === "board") return <TaskBoard />;

  return <TaskTable />;
};

export default TaskManagerBody;
