"use client";

import { Pyramid } from "lucide-react";
import TaskSelectDropdown from "./task-select-dropdown";

export default function TaskSelectPriority() {
  return (
    <TaskSelectDropdown
      name="priority"
      Icon={Pyramid}
      iconClassName="text-primary-yellow"
      options={[
        { value: "high", label: "🔴 High" },
        { value: "medium", label: "🟡 Medium" },
        { value: "low", label: "🟢 low" },
      ]}
    />
  );
}
