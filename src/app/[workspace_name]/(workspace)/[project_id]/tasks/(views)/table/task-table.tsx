"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import TaskTableBody from "./task-table-body";
import TaskTableHeader from "./task-table-header";
import { useTaskStore } from "../../store/useTaskStore";

const TaskTable = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const { visibleColumns } = useTaskStore();

  const [columnWidths, setColumnWidths] = useState<number[]>(
    Array(visibleColumns.length).fill(213),
  );

  useEffect(() => {
    const el = containerRef.current;

    const checkScroll = () => {
      if (!el) return;
      setHasHorizontalScroll(el.scrollWidth > el.clientWidth);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  return (
    <div ref={containerRef} className="overflow-x-auto text-xs">
      <TaskTableHeader
        columnWidths={columnWidths}
        setColumnWidths={setColumnWidths}
        visibleColumns={visibleColumns.filter((c) => !c.isHidden)}
        hasHorizontalScroll={hasHorizontalScroll}
      />
      <TaskTableBody
        columnWidths={columnWidths}
        hasHorizontalScroll={hasHorizontalScroll}
      />
    </div>
  );
};

export default TaskTable;
