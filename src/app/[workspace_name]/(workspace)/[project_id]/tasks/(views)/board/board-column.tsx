import { TaskViewList } from "@/src/types/tasks";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import TaskCard from "./task-card";

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
    estimateSize: () => 120, // rough estimate in px
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <div className="flex w-64 shrink-0 flex-col rounded-lg bg-muted/50">
      <div className="p-3 capitalize">
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
              data-index={item.index}
              ref={virtualizer.measureElement} // 👈 this is the fix
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
export default BoardColumn;
