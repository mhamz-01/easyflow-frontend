"use client";
import { useEffect, useState } from "react";
import TaskTableBody from "./task-table-body";
import TaskTableHeader from "./task-table-header";

const TaskTable = () => {
  const [columnStyle, setColumnStyle] = useState(`grid-cols-[repeat(5,213px)]`);
  const [visibleColumns, setVisibleColumns] = useState([
    {
      id: 1,
      label: "Name",
      isHidden: false,
    },
    {
      id: 2,
      label: "Assignee",
      isHidden: false,
    },
    {
      id: 3,
      label: "Priority",
      isHidden: false,
    },
    {
      id: 4,
      label: "State",
      isHidden: false,
    },
    {
      id: 5,
      label: "Due Date",
      isHidden: false,
    },
  ]);

  useEffect(() => {}, []);

  return (
    <div className="text-xs">
      <TaskTableHeader
        columnStyle={columnStyle}
        setColumnStyle={setColumnStyle}
        visibleColumns={visibleColumns}
      />
      <TaskTableBody columnStyle={columnStyle} />
    </div>
  );
};

export default TaskTable;
