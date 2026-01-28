import { ChevronDown, UserRoundSearch } from "lucide-react";
import { Field } from "../../shadcn/field";
import TaskCollapsibleButton from "./task-collapsible-button";
import TaskSearchInput from "./task-search-input";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";
import { ReactNode, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import { cn } from "@/src/lib/utils";
import { StaticImageData } from "next/image";
import TaskPopover from "./task-popover";
import TaskDropdown from "./task-dropdown";

const TaskSelectAssignees = () => {
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  return (
    <TaskPopover
      inputName="assignees"
      Icon={UserRoundSearch}
      iconClassName="text-purple-500"
    >
      <TaskSearchInput
        search={search}
        setSearch={setSearch}
        setIsOpen={setIsOpen}
      />
      {/* <TaskDropdown
        items={filteredDocs}
        inputName="documents"
        getId={(doc) => doc.id!}
        getLabel={(doc) => doc.documentName!}
        isOpen={isOpen}
        iconSrc={docsIcon}
        setIsOpen={setIsOpen}
      /> */}
    </TaskPopover>
  );
};

export default TaskSelectAssignees;
