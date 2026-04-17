import { useTaskStore } from "../../store/useTaskStore";
import { getColorFromGroup } from "@/src/lib/utils";
import { TaskViewList } from "@/src/types/tasks";
import { RowCell } from "../../components/row-cell";
import { EditableTaskNameInput } from "../../components/editable-taskname-input";
import SelectAssignees from "@/src/components/dropdown-select/select-assignees";
import { useUpdateTask } from "@/src/hooks/tasks";
import { useMemo, useState } from "react";
import PriorityCell from "../../components/priority-cell";
import StateCell from "../../components/state-cell";
import DateCell from "../../components/date-cell";

const TaskTableBody = ({
  tasks = [],
  columnWidths,
  hasHorizontalScroll,
}: {
  tasks: TaskViewList[];
  columnWidths: number[];
  hasHorizontalScroll: boolean;
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<number>(0);
  // update assigned user
  const { mutate, isPending } = useUpdateTask();
  const { visibleColumns, sortBy, groupBy, setSelectedTask, setIsOpen } =
    useTaskStore();

  const visible = visibleColumns.filter((c) => !c.isHidden);

  // Sorting
  if (sortBy !== "none") {
    tasks.sort((a: any, b: any) => (a[sortBy] > b[sortBy] ? 1 : -1));
  }

  // Grouping
  const grouped = useMemo(() => {
    if (groupBy === "none") return { All: tasks };

    return tasks.reduce((acc: any, task: any) => {
      if (groupBy === "assignee") {
        const assignees = task.assignees?.length
          ? task.assignees
          : [{ username: "unassigned" }];

        assignees.forEach((a: any) => {
          const key = a.username ?? "unassigned";
          if (!acc[key]) acc[key] = [];
          acc[key].push(task);
        });
      } else {
        const key = task[groupBy] ?? "unknown";
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
      }

      return acc;
    }, {});
  }, [tasks, groupBy]);

  return (
    <div className="text-[#D5D6D7]">
      {Object.entries(grouped).map(([group, tasks]) => (
        <div key={group}>
          {groupBy !== "none" && (
            <div className="px-4 py-4">
              {(() => {
                const color = getColorFromGroup(group);
                return (
                  <div className="flex items-center gap-3">
                    <div
                      className="h-6 w-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />

                    <h2 className="text-base font-semibold" style={{ color }}>
                      {group}
                    </h2>

                    <span className="text-xs text-muted-foreground">
                      {2} tasks
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
          {(tasks as TaskViewList[]).map((task) => (
            <div
              key={task.id}
              className={`grid h-12 font-bold group ${hasHorizontalScroll ? "" : "border-l-0 border-r border "} hover:bg-gray-50`}
              style={{
                gridTemplateColumns: columnWidths
                  .slice(0, visible.length)
                  .map((w) => `${w}px`)
                  .join(" "),
              }}
            >
              {visible.map((column, index) => {
                const isLast = index === visible.length - 1;
                const commonClass = `px-4 flex items-center truncate ${hasHorizontalScroll ? "border" : "border-l-1 border-r-0"}  ${
                  !isLast ? "" : hasHorizontalScroll ? "border-r-1" : ""
                }`;

                switch (column.label) {
                  case "Name":
                    return (
                      <RowCell key={column.id} commonClass={commonClass}>
                        <EditableTaskNameInput
                          task={task}
                          role="admin"
                          onOpen={() => setIsOpen(true)}
                        />
                      </RowCell>
                    );

                  case "Assignee":
                    return (
                      <RowCell key={column.id} commonClass={commonClass}>
                        <SelectAssignees
                          selectedIds={task.assignees.map(
                            (assignee) => assignee.id,
                          )}
                          onSelect={(selectedIds) => {
                            mutate({
                              taskId: task.id,
                              payload: { assigneeIds: selectedIds },
                            });
                          }}
                        />
                      </RowCell>
                    );
                  case "Priority":
                    return (
                      <RowCell key={column.id} commonClass={commonClass}>
                        <PriorityCell
                          taskId={task.id}
                          priority={task.priority}
                        />
                      </RowCell>
                    );

                  case "State":
                    return (
                      <RowCell key={column.id} commonClass={commonClass}>
                        <StateCell taskId={task.id} state={task.state} />
                      </RowCell>
                    );

                  case "Due Date":
                    return (
                      <RowCell key={column.id} commonClass={commonClass}>
                        <DateCell taskId={task.id} date={task.dueDate} />
                      </RowCell>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskTableBody;
