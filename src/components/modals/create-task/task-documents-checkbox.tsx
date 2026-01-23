"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Field } from "../../shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../shadcn/input-group";
import TaskCollapsibleButton from "./task-collapsible-button";
import { getAllDocs } from "@/src/lib/api/documents/services";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useWorkspaceStore } from "@/src/store/workspace";
import { docsKeys } from "@/src/lib/api/documents/keys";

type Doc = {
  id: number;
  documentName: string;
};

export default function TaskDocumentCheckbox() {
  const project = useProjectStore((s) => s.project);
  const workspace = useWorkspaceStore((s) => s.workspace);
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: docsKeys.all(workspace!.id, project!.id),
    queryFn: () =>
      getAllDocs({ workspaceId: workspace!.id, projectId: project!.id }),
  });

  const docs: Doc[] = data?.docs ?? [];

  // 2️⃣ Local filtering
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) =>
      doc.documentName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, docs]);

  useEffect(() => {
    console.log("data0", data);
  }, [data]);

  return (
    <TaskCollapsibleButton title="Add documents">
      <Field className="relative max-w-sm">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>

        {/* 3️⃣ Dropdown */}
        {filteredDocs.length > 0 && (
          <div className="absolute z-50 top-10 mt-1 w-full rounded-md border bg-background shadow">
            <ul className="max-h-48 overflow-auto">
              {filteredDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => {
                    console.log("Selected doc:", doc);
                    setSearch("");
                  }}
                >
                  {doc.documentName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Field>
    </TaskCollapsibleButton>
  );
}
