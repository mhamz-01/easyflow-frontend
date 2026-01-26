"use client";

import { CircleDashed } from "lucide-react";
import TaskSelectDropdown from "./task-select-dropdown";

export default function TaskSelectStatus() {
  return (
    <TaskSelectDropdown
      name="status"
      Icon={CircleDashed}
      iconClassName="text-primary-blue"
      options={[
        { value: "todo", label: "🟠 Todo" },
        { value: "in-progress", label: "🔵 In Progress" },
        { value: "done", label: "🟢 Done" },
      ]}
    />
  );
}
