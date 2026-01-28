"use client";
import { useEffect, useState } from "react";
import { Button } from "../../../../../components/shadcn/button";
import {
  SidebarTrigger,
  useSidebar,
} from "../../../../../components/shadcn/sidebar";
import Breadcrumbs from "../../../../../components/custom/breadcrumbs";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useAuth } from "@clerk/nextjs";
import { createDoc } from "@/src/lib/api/documents/services";
import { Spinner } from "../../../../../components/shadcn/spinner";
import { Ellipsis, Maximize, Users, X } from "lucide-react";
import { createdDocResponse, docsListResponse } from "@/src/types/documents";

// This header will be used for docs, whiteboards and tasks page
export function DocsHeader() {
  const { open } = useSidebar();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const project = useProjectStore((s) => s.project);
  const { userId } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // local states

  const mutationDocs = useMutation({
    mutationFn: createDoc,
    onSuccess: (data: createdDocResponse) => {
      router.push(`docs/${data.createdDoc.id}`);
      queryClient.setQueryData(
        ["docs", workspace?.id, project?.id],
        (oldData: Partial<docsListResponse>) => {
          return {
            ...oldData,
            docs: [
              {
                id: data.createdDoc.id,
                documentName: data.createdDoc.documentName,
                assignees: data.createdDoc.assignees,
              },
              ...(oldData.docs || []),
            ],
          };
        },
      );
    },
  });

  // handle create
  const handleCreate = () => {
    // check for doc type
    if (workspace?.id && project?.id && userId) {
      mutationDocs.mutate({
        workspaceId: workspace?.id,
        projectId: project?.id,
        createdBy: userId,
      });
    }
  };

  return (
    <section className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        {/* Only show the SidebarTrigger if the sidebar is closed && it is mobile view */}
        {<SidebarTrigger className={!open ? "" : "md:hidden"} />}
        <Breadcrumbs
          items={[
            { label: "Home", path: `/${workspace?.workspaceSlug ?? "/"}` },
            { label: project?.projectName, path: "#" },
            { label: "Task", path: "" },
          ]}
        />
      </div>
      {/* actions when doc | whitboard | task is open */}
      <div className="flex items-center gap-5 border-2 overflow-hidden p-3 rounded-2xl">
        <Users size={18} />
        <span>share</span>
        <Ellipsis size={18} />
        <Maximize size={18} />
        <X size={18} />
      </div>
      <Button
        onClick={handleCreate}
        variant="primary"
        className="relative"
        disabled={mutationDocs.isPending}
      >
        {/* Invisible text keeps width */}
        <span className={mutationDocs.isPending ? "invisible" : "visible"}>
          Create Document
        </span>

        {/* Spinner overlay */}
        {mutationDocs.isPending && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </span>
        )}
      </Button>
    </section>
  );
}
