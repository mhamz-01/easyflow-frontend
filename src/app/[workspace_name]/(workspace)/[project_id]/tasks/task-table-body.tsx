import Avatar from "@/src/components/custom/avatar";

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
    priority: "Medium",
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
];

const TaskTableBody = ({ columnStyle }: { columnStyle: string }) => {
  return (
    <div className="overflow-x-auto text-[#D5D6D7]">
      <div className="min-w-max">
        {dummyTasks.map((task) => (
          <div
            key={task.id}
            className={`grid ${columnStyle} h-10 border font-bold`}
          >
            <div className="px-4 flex items-center truncate border-r">
              {task.name}
            </div>
            <div className="px-4 flex items-center gap-2 truncate border-r">
              <Avatar
                src={
                  "https://avatars.githubusercontent.com/u/96257586?v=4&size=64"
                }
              />{" "}
              {task.assignee}
            </div>
            <div className="px-4 flex items-center border-r">
              {task.priority}
            </div>
            <div className="px-4 flex items-center border-r">{task.state}</div>
            <div className="px-4 flex items-center border-r">
              {task.dueDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTableBody;
