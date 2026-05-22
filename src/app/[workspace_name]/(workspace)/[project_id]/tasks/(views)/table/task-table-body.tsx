import { useTaskStore } from "../../store/useTaskStore";
import { getColorFromGroup } from "@/src/lib/utils";
import { TaskViewList } from "@/src/types/tasks";
import { RowCell } from "../../components/row-cell";
import { EditableTaskNameInput } from "../../components/editable-taskname-input";
import SelectAssignees from "@/src/components/dropdown-select/select-assignees";
import { useUpdateTask } from "@/src/hooks/tasks";
import { useMemo } from "react";
import PriorityCell from "../../components/priority-cell";
import StateCell from "../../components/state-cell";
import DateCell from "../../components/date-cell";
import { COMPARATORS } from "../../utils";
import { useUserStore } from "@/src/store/useUserStore";
import DeleteTaskButton from "../../components/delete-task-button";

const TaskTableBody = ({
  tasks = [],
  columnWidths,
  hasHorizontalScroll,
}: {
  tasks: TaskViewList[];
  columnWidths: number[];
  hasHorizontalScroll: boolean;
}) => {
  const { isAdmin } = useUserStore();
  const { mutate } = useUpdateTask();
  const { visibleColumns, sortBy, groupBy, setIsOpen } = useTaskStore();
  

  const visible = visibleColumns.filter((c) => !c.isHidden);

  // Sorting
  const sortedTasks = useMemo(() => {
    if (sortBy === "none") return tasks;
    const comparator = COMPARATORS[sortBy];
    if (!comparator) return tasks;
    return [...tasks].sort(comparator);
  }, [tasks, sortBy]);

  // Grouping
  const grouped = useMemo(() => {
    if (groupBy === "none") return { All: sortedTasks };

    return sortedTasks.reduce((acc: any, task: any) => {
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
  }, [sortedTasks, groupBy]);

  return (
    <div className="text-[#D5D6D7]">
      {Object.entries(grouped).map(([group, groupTasks]) => (
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
                    {/* ✅ fixed hardcoded {2} */}
                    <span className="text-xs text-muted-foreground">
                      {(groupTasks as TaskViewList[]).length} tasks
                    </span>
                  </div>
                );
              })()}
            </div>
          )}

          {(groupTasks as TaskViewList[]).map((task) => (
            <div
              key={task.id}
              className={`grid h-12 font-bold group ${
                hasHorizontalScroll ? "" : "border-l-0 border-r border"
              } hover:bg-gray-50`}
              style={{
                gridTemplateColumns: [
                  ...columnWidths
                    .slice(0, visible.length)
                    .map((w) => `${w}px`),
                  ]
                  .filter(Boolean)
                  .join(" "),
              }}
            >
              {visible.map((column, index) => {
                const isLast = index === visible.length - 1;
                const commonClass = `px-4 flex items-center truncate ${
                  hasHorizontalScroll ? "border" : "border-l-1 border-r-0"
                } ${
                  !isLast ? "" : hasHorizontalScroll ? "border-r-1" : ""
                }`;

                switch (column.label) {
                  case "Name":
                    return (
                      <RowCell key={column.id} commonClass={commonClass}>
                        <div className="flex items-center justify-between w-full">
                          <EditableTaskNameInput
                            task={task}
                            role="admin"
                            onOpen={() => setIsOpen(true, task.id)}
                          />
                          
                          {!isAdmin && (
                            <DeleteTaskButton taskId={task.id} taskName={task.name} />
                          )}
                        </div>
                      </RowCell>
                    );

                  case "Assignee":
                    return (
                      <RowCell key={column.id} commonClass={commonClass}>
                        <SelectAssignees
                          selectedIds={task.assignees.map((a) => a.id)}
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