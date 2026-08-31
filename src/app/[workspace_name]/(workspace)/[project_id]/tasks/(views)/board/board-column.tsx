"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { TaskViewList } from "@/src/types/tasks";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import CreateTaskModal from "@/src/components/modals/create-task";
import TaskCard from "./task-card";
import DraggableTaskCard from "./draggable-task-card";
import { getColumnTheme } from "./board-theme";

const BoardColumn = ({
  groupBy,
  groupKey,
  tasks,
  draggable,
  index,
}: {
  groupBy: string;
  groupKey: string;
  tasks: TaskViewList[];
  draggable: boolean;
  index: number;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: groupKey, disabled: !draggable });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const theme = getColumnTheme(groupBy, groupKey, index);

  // quick-create only makes sense when the column maps 1:1 onto a task field
  const canQuickCreate = groupBy === "none" || groupBy === "state" || groupBy === "priority";

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-2xl border ${theme.border} ${theme.columnBg} ${
        isOver ? `ring-2 ring-inset ${theme.ring}` : ""
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between gap-2 rounded-t-2xl px-3.5 py-3 ${theme.headerBg}`}>
        <div className="flex min-w-0 items-center gap-2">
          <span className={`size-2 shrink-0 rounded-full ${theme.dot}`} />
          <h3 className={`truncate text-sm font-semibold capitalize ${theme.headerText}`}>{groupKey}</h3>
        </div>
        <span className={`shrink-0 rounded-full bg-background/60 px-2 py-0.5 text-[11px] font-medium ${theme.headerText}`}>
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
        style={{ maxHeight: "calc(100vh - 260px)" }}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/10 py-8 text-center text-xs text-muted-foreground">
            {draggable ? "Drop a task here" : "No tasks"}
          </div>
        ) : (
          tasks.map((task) =>
            draggable ? (
              <DraggableTaskCard key={task.id} task={task} columnKey={groupKey} accent={theme.accent} />
            ) : (
              <TaskCard key={task.id} task={task} accent={theme.accent} />
            ),
          )
        )}
      </div>

      {/* Quick add */}
      {canQuickCreate && (
        <div className="p-2 pt-0">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
              >
                <Plus className="size-3.5" />
                Add task
              </button>
            </DialogTrigger>
            <CreateTaskModal
              onClose={() => setIsCreateOpen(false)}
              defaultState={groupBy === "priority" ? undefined : groupKey}
              defaultPriority={groupBy === "priority" ? groupKey : undefined}
            />
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default BoardColumn;
