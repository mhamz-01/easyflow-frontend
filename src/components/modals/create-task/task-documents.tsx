"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Field } from "../../shadcn/field";
import TaskCollapsibleButton from "./task-collapsible-button";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";
import { docsKeys } from "@/src/lib/api/documents/keys";

import { singleDoc,Doc } from "@/src/types/documents";
import docsIcon from "@/public/icons/docs.svg";
import TaskDropdown from "./task-dropdown";
import DropdownSearchInput from "../../dropdown-search-input";
import { useFormContext, useWatch } from "react-hook-form";
import { Popover, PopoverAnchor, PopoverContent } from "../../shadcn/popover";

export default function TaskDocumentCheckbox() {
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const { control } = useFormContext();
  const selectedDocs: (string | number)[] = useWatch({ control, name: "documents" }) || [];


  const { data } = useQuery({
    queryKey: docsKeys.all(workspace!.id, project!.id),
    queryFn: () =>
      getAllDocs({ workspaceId: workspace!.id, projectId: project!.id }),
  });

  const docs: Doc[] = data?.docs ?? [];

  // 2️⃣ Local filtering
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      if (doc.documentName) {
        return doc.documentName.toLowerCase().includes(search.toLowerCase());
      }
    });
  }, [search, docs]);

  return (
    <TaskCollapsibleButton
    title="Add documents"
    img={docsIcon}
    badgeCount={selectedDocs.length}
  >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <Field className="max-w-sm">
            {/* search input */}
            <DropdownSearchInput
              search={search}
              setSearch={setSearch}
              setIsOpen={setIsOpen}
            />
          </Field>
        </PopoverAnchor>
        {/* Portaled to document.body — the list can never fight the modal's
            own scroll container for space or leak a scrollbar into it,
            regardless of how many docs there are or how tall the form
            currently is. */}
        <PopoverContent
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-80 p-0"
        >
          <TaskDropdown
            items={filteredDocs}
            inputName="documents"
            getId={(doc) => doc.id!}
            getLabel={(doc) => doc.documentName!}
            isOpen={isOpen}
            iconSrc={docsIcon}
            setIsOpen={setIsOpen}
          />
        </PopoverContent>
      </Popover>
    </TaskCollapsibleButton>
  );
}
