import TaskPopover from "./task-popover";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import TaskSearchInput from "./task-search-input";
import { useState } from "react";
export default function TaskSelectWhiteboard() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  return (
    <TaskPopover inputName="whiteboards" imgSrc={whiteboardIcon}>
      <TaskSearchInput
        search={search}
        setSearch={setSearch}
        setIsOpen={setIsOpen}
      />
    </TaskPopover>
  );
}
