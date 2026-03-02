import Avatar from "@/src/components/custom/avatar";
import { useTaskStore } from "../../store/useTaskStore";
import { Maximize2 } from "lucide-react";
import { getColorFromGroup } from "@/src/lib/utils";
const dummyTasks = [
  {
    id: 1,
    name: "Build UI Components",
    assignee: "Afaq",
    priority: "High",
    state: "In Progress",
    dueDate: "2026-02-25",
  },
  {
    id: 2,
    name: "Fix Login Bug",
    assignee: "Ali",
    priority: "medium",
    state: "Todo",
    dueDate: "2026-02-28",
  },
  {
    id: 3,
    name: "Deploy Backend",
    assignee: "Ahmed",
    priority: "Low",
    state: "Done",
    dueDate: "2026-03-05",
  },
  {
    id: 4,
    name: "Design Landing Page",
    assignee: "Sara",
    priority: "High",
    state: "In Progress",
    dueDate: "2026-03-01",
  },
  {
    id: 5,
    name: "Integrate Payment Gateway",
    assignee: "Bilal",
    priority: "High",
    state: "Todo",
    dueDate: "2026-03-03",
  },
  {
    id: 6,
    name: "Write Unit Tests",
    assignee: "Afaq",
    priority: "Medium",
    state: "In Progress",
    dueDate: "2026-03-04",
  },
  {
    id: 7,
    name: "Fix CSS Issues",
    assignee: "Sara",
    priority: "Low",
    state: "Todo",
    dueDate: "2026-03-02",
  },
  {
    id: 8,
    name: "Optimize Database Queries",
    assignee: "Ahmed",
    priority: "High",
    state: "In Progress",
    dueDate: "2026-03-06",
  },
  {
    id: 9,
    name: "Set Up CI/CD Pipeline",
    assignee: "Bilal",
    priority: "Medium",
    state: "Todo",
    dueDate: "2026-03-07",
  },
  {
    id: 10,
    name: "Update Documentation",
    assignee: "Afaq",
    priority: "Low",
    state: "Done",
    dueDate: "2026-03-01",
  },
  {
    id: 11,
    name: "Conduct User Testing",
    assignee: "Sara",
    priority: "Medium",
    state: "Todo",
    dueDate: "2026-03-08",
  },
  {
    id: 12,
    name: "Bug Fix: Profile Page",
    assignee: "Ali",
    priority: "High",
    state: "In Progress",
    dueDate: "2026-03-05",
  },
];

const TaskTableBody = ({
  columnWidths,
  hasHorizontalScroll,
}: {
  columnWidths: number[];
  hasHorizontalScroll: boolean;
}) => {
  const { visibleColumns, sortBy, groupBy, setSelectedTask, setIsOpen } =
    useTaskStore();

  const visible = visibleColumns.filter((c) => !c.isHidden);

  let tasks = [...dummyTasks];

  // Sorting
  if (sortBy !== "none") {
    tasks.sort((a: any, b: any) => (a[sortBy] > b[sortBy] ? 1 : -1));
  }

  // Grouping
  const grouped =
    groupBy !== "none"
      ? tasks.reduce((acc: any, task: any) => {
          const key = task[groupBy];
          if (!acc[key]) acc[key] = [];
          acc[key].push(task);
          return acc;
        }, {})
      : { All: tasks };

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
          {(tasks as any[]).map((task) => (
            <div
              key={task.id}
              className={`grid h-10 font-bold group ${hasHorizontalScroll ? "" : "border-l-0 border-r border "} hover:bg-gray-50`}
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
                      <div
                        key={column.id}
                        className={`${commonClass} justify-between`}
                      >
                        <span className="truncate">{task.name}</span>

                        <Maximize2
                          className="h-3 w-3 opacity-0 group-hover:opacity-100 cursor-pointer "
                          onClick={() => {
                            setIsOpen(true);
                            setSelectedTask(task);
                          }}
                        />
                      </div>
                    );

                  case "Assignee":
                    return (
                      <div key={column.id} className={`${commonClass} gap-2`}>
                        <Avatar
                          src="https://avatars.githubusercontent.com/u/96257586?v=4&size=64"
                          className="min-w-6.5 min-h-6.5"
                        />
                        {task.assignee}
                      </div>
                    );

                  case "Priority":
                    return (
                      <div key={column.id} className={commonClass}>
                        {task.priority}
                      </div>
                    );

                  case "State":
                    return (
                      <div key={column.id} className={commonClass}>
                        {task.state}
                      </div>
                    );

                  case "Due Date":
                    return (
                      <div key={column.id} className={commonClass}>
                        {task.dueDate}
                      </div>
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
