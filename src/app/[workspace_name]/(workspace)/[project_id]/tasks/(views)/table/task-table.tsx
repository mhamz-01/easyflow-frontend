"use client";
import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TaskTableBody from "./task-table-body";
import TaskTableHeader from "./task-table-header";
import { useTaskStore } from "../../store/useTaskStore";
import { taskService } from "@/src/lib/api/tasks/service";
import TaskLoadingSkeleton from "../../components/task-loading-skeleton";

const TaskTable = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const { visibleColumns } = useTaskStore();
  const { project_id } = useParams();
  const [columnWidths, setColumnWidths] = useState<number[]>(
    Array(visibleColumns.length).fill(213),
  );

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", project_id],
    queryFn: () => taskService.getTasksByProject(Number(project_id)),
    enabled: !!project_id, // only fetch when projectId exists
  });

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

  if (isLoading) return <TaskLoadingSkeleton />;

  return (
    <div ref={containerRef} className="overflow-x-auto text-xs">
      <TaskTableHeader
        columnWidths={columnWidths}
        setColumnWidths={setColumnWidths}
        visibleColumns={visibleColumns.filter((c) => !c.isHidden)}
        hasHorizontalScroll={hasHorizontalScroll}
      />
      <TaskTableBody
        tasks={tasks}
        columnWidths={columnWidths}
        hasHorizontalScroll={hasHorizontalScroll}
      />
    </div>
  );
};

export default TaskTable;
