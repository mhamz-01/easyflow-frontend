"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Field } from "../../shadcn/field";
import TaskCollapsibleButton from "./task-collapsible-button";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";
import { docsKeys } from "@/src/lib/api/documents/keys";
import TaskDocumentsSearchInput from "./task-documents-search-input";
import TaskDocumentDropdown from "./task-documents-dropdown";
import { singleDoc } from "@/src/types/documents";
import docsIcon from "@/public/icons/docs.svg";

export default function TaskDocumentCheckbox() {
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const { data } = useQuery({
    queryKey: docsKeys.all(workspace!.id, project!.id),
    queryFn: () =>
      getAllDocs({ workspaceId: workspace!.id, projectId: project!.id }),
  });

  const docs: Partial<singleDoc>[] = data?.docs ?? [];

  // 2️⃣ Local filtering
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      if (doc.documentName) {
        return doc.documentName.toLowerCase().includes(search.toLowerCase());
      }
    });
  }, [search, docs]);

  useEffect(() => {
    console.log("data0", data);
  }, [data]);

  useEffect(() => {
    console.log("Docs input rendred");
  }, []);

  return (
    <TaskCollapsibleButton title="Add documents" img={docsIcon}>
      <Field className="relative max-w-sm">
        {/* search input */}
        <TaskDocumentsSearchInput
          search={search}
          setSearch={setSearch}
          setIsOpen={setIsOpen}
        />

        {/* dropdown */}
        <TaskDocumentDropdown
          filteredDocs={filteredDocs}
          setSearch={setSearch}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </Field>
    </TaskCollapsibleButton>
  );
}
