"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Field } from "../../shadcn/field";
import TaskCollapsibleButton from "./task-collapsible-button";
import { getAllWhiteboards } from "@/src/lib/api/whiteboards/services";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import TaskDropdown from "./task-dropdown";
import DropdownSearchInput from "../../dropdown-search-input";

export default function TaskSelectWhiteboard() {
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const { data } = useQuery({
    queryKey: ["whiteboards", workspace?.id, project?.id],
    queryFn: () =>
      getAllWhiteboards({ workspaceId: workspace!.id, projectId: project!.id }),
    enabled: !!workspace?.id && !!project?.id,
  });

  const whiteboards = data?.whiteboards ?? [];

  const filteredWhiteboards = useMemo(() => {
    return whiteboards.filter((wb) =>
      wb.whiteboardName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, whiteboards]);

  return (
    <TaskCollapsibleButton title="Add whiteboards" img={whiteboardIcon}>
      <Field className="relative max-w-sm">
        <DropdownSearchInput
          search={search}
          setSearch={setSearch}
          setIsOpen={setIsOpen}
        />
        <TaskDropdown
          items={filteredWhiteboards}
          inputName="whiteboards"         
          getId={(wb) => wb.id}
          getLabel={(wb) => wb.whiteboardName}
          isOpen={isOpen}
          iconSrc={whiteboardIcon}
          setIsOpen={setIsOpen}
        />
      </Field>
    </TaskCollapsibleButton>
  );
}