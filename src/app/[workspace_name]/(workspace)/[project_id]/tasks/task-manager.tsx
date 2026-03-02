import TaskDetailsDrawer from "./components/task-details-drawer";
import TaskManagerBody from "./task-manager-body";
import TaskManagerHeader from "./task-manager-header";

const TaskManager = () => {
  return (
    <div>
      <TaskManagerHeader />
      <TaskManagerBody />
      <TaskDetailsDrawer />
    </div>
  );
};

export default TaskManager;
