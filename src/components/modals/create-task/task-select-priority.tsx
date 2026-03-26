"use client";

import { Pyramid } from "lucide-react";
import { SelectDropdownForm } from "../../single-select-dropdown/SelectDropdownForm";

export default function TaskSelectPriority() {
  return (
    <SelectDropdownForm
      name="priority"
      Icon={Pyramid}
      iconClassName="text-primary-yelow"
      options={[
        { value: "high", label: "🔴 High" },
        { value: "medium", label: "🟡 Medium" },
        { value: "low", label: "🟢 low" },
      ]}
    />
  );
}
