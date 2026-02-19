import { TasksHeader } from "@/src/app/[workspace_name]/(workspace)/[project_id]/tasks/header";
import TaskManager from "./task-manager";
const page = () => {
  return (
    <section className="px-4">
      <TasksHeader />
      <TaskManager />
    </section>
  );
};

export default page;
