import TaskPopover from "./task-popover";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import { useState } from "react";
import DropdownSearchInput from "../../dropdown-search-input";
export default function TaskSelectWhiteboard() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  return (
    <TaskPopover inputName="whiteboards" imgSrc={whiteboardIcon}>
      <DropdownSearchInput
        search={search}
        setSearch={setSearch}
        setIsOpen={setIsOpen}
      />
    </TaskPopover>
  );
}
