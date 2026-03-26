"use client";

import { CircleDashed } from "lucide-react";
import { SelectDropdownForm } from "../../single-select-dropdown/SelectDropdownForm";

export default function TaskSelectStatus() {
  return (
    <SelectDropdownForm
      name="state"
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
