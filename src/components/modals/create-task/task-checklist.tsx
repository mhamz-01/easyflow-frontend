"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import TaskCollapsibleButton from "./task-collapsible-button";
import { ListCheck } from "lucide-react";

type ChecklistItem = {
  name: string;
  items: string[];
};

const TaskChecklist = () => {
  const { control, setValue } = useFormContext();

  const checklist: ChecklistItem[] =
    useWatch({
      control,
      name: "checklist",
    }) || [];

  /* ---------------- Checklist CRUD ---------------- */

  const addChecklist = () => {
    setValue("checklist", [...checklist, { name: "New Checklist", items: [] }]);
  };

  const updateChecklistName = (index: number, name: string) => {
    const updated = checklist.map((c, i) => (i === index ? { ...c, name } : c));
    setValue("checklist", updated);
  };

  const deleteChecklist = (index: number) => {
    setValue(
      "checklist",
      checklist.filter((_, i) => i !== index),
    );
  };

  /* ---------------- Item CRUD ---------------- */

  const addItem = (checklistIndex: number) => {
    const updated = checklist.map((c, i) =>
      i === checklistIndex ? { ...c, items: [...c.items, ""] } : c,
    );
    setValue("checklist", updated);
  };

  const updateItem = (
    checklistIndex: number,
    itemIndex: number,
    value: string,
  ) => {
    const updated = checklist.map((c, i) =>
      i === checklistIndex
        ? {
            ...c,
            items: c.items.map((item, j) => (j === itemIndex ? value : item)),
          }
        : c,
    );
    setValue("checklist", updated);
  };

  const deleteItem = (checklistIndex: number, itemIndex: number) => {
    const updated = checklist.map((c, i) =>
      i === checklistIndex
        ? {
            ...c,
            items: c.items.filter((_, j) => j !== itemIndex),
          }
        : c,
    );
    setValue("checklist", updated);
  };

  /* ---------------- UI ---------------- */

  return (
    <TaskCollapsibleButton
      title="Add checklist"
      Icon={ListCheck}
      iconClassNames="text-green-500"
    >
      <div className="space-y-4">
        {checklist.map((list, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            {/* Checklist Header */}
            <div className="flex items-center gap-2">
              <Input
                value={list.name}
                onChange={(e) => updateChecklistName(i, e.target.value)}
                placeholder="Checklist name"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => deleteChecklist(i)}
              >
                Delete
              </Button>
            </div>

            {/* Items */}
            <div className="space-y-2 pl-2">
              {list.items.map((item, j) => (
                <div key={j} className="flex gap-2">
                  <Input
                    value={item}
                    placeholder="Checklist item"
                    onChange={(e) => updateItem(i, j, e.target.value)}
                    className=""
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteItem(i, j)}
                  >
                    ✕
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => addItem(i)}
              >
                + Add item
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          onClick={addChecklist}
          className="px-3 h-8 text-sm"
        >
          + Add checklist
        </Button>
      </div>
    </TaskCollapsibleButton>
  );
};

export default TaskChecklist;
