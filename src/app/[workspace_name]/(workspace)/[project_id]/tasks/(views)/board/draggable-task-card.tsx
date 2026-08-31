"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { TaskViewList } from "@/src/types/tasks";
import TaskCard from "./task-card";

const DraggableTaskCard = ({
  task,
  columnKey,
  accent,
}: {
  task: TaskViewList;
  columnKey: string;
  accent: string;
}) => {
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
    id: task.id,
    data: { columnKey },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform), touchAction: "none" }}
      className={`cursor-grab rounded-xl transition-opacity active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <TaskCard task={task} accent={accent} />
    </div>
  );
};

export default DraggableTaskCard;
