"use client";

import { useState, useRef, useEffect } from "react";
import { Maximize2, Check } from "lucide-react";
import { TaskViewList } from "@/src/types/tasks";
import { useUpdateTask } from "@/src/hooks/tasks";

interface EditableTaskNameInputProps {
  task: TaskViewList;
  role: string;
  onOpen: () => void;
}

export const EditableTaskNameInput = ({
  task,
  role,
  onOpen,
}: EditableTaskNameInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const isViewer = role === "viewer";

  const { mutate, isPending } = useUpdateTask({
    onSuccess: () => setIsEditing(false),
    onError: () => {
      setValue(task.name);
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (isViewer) return;
    setIsEditing(true);
  };

  const handleConfirm = () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === task.name) {
      setValue(task.name);
      setIsEditing(false);
      return;
    }
    mutate({ taskId: task.id, payload: { name: trimmed } });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") {
      setValue(task.name);
      setIsEditing(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleConfirm}
          disabled={isPending}
          className="flex-1 truncate bg-transparent outline-none border-b text-xs"
        />
      ) : (
        <span className="truncate flex-1" onDoubleClick={handleDoubleClick}>
          {value}
        </span>
      )}

      {isEditing ? (
        <Check className="h-3 w-3 cursor-pointer" onClick={handleConfirm} />
      ) : (
        <Maximize2
          className="h-3 w-3 opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
          onClick={onOpen}
        />
      )}
    </>
  );
};
