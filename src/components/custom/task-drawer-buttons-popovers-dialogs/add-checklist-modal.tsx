"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { Label } from "@/src/components/shadcn/label";
import { Spinner } from "@/src/components/shadcn/spinner";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

interface AddChecklistModalProps {
  isPending: boolean;
  onSubmit: (group: { name: string; items: string[] }) => void;
}

const AddChecklistModal = ({ isPending, onSubmit }: AddChecklistModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [items, setItems] = useState<string[]>([""]);

  const addItem = () => setItems((prev) => [...prev, ""]);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (index: number, value: string) =>
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));

  const handleSubmit = () => {
    const validItems = items.filter((i) => i.trim() !== "");
    if (!groupName.trim() || validItems.length === 0) return;
    onSubmit({ name: groupName.trim(), items: validItems });
    setGroupName("");
    setItems([""]);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create Checklist</DialogTitle>
        <DialogDescription>Add a checklist group with items to this task.</DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div className="flex flex-col">
          <Label>Group Name</Label>
          <Input
            className="mt-2"
            placeholder="e.g. Design Review"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Items</Label>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Item ${index + 1}`}
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={addItem}
          >
            <Plus size={14} className="mr-1" />
            Add item
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm">Cancel</Button>
          </DialogClose>
          <Button
            size="sm"
            variant="primary"
            disabled={isPending || !groupName.trim()}
            onClick={handleSubmit}
          >
            {isPending ? <Spinner /> : "Create Checklist"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default AddChecklistModal;