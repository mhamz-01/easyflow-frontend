"use client";
import { useState } from "react";
import { useIsMutating } from "@tanstack/react-query";
import {
  SidebarTrigger,
  useSidebar,
} from "../../../../../components/shadcn/sidebar";
import Breadcrumbs from "../../../../../components/custom/breadcrumbs";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import CreateTaskModal from "@/src/components/modals/create-task";

// This header will be used for docs, whiteboards and tasks page
export function TasksHeader() {
  const { open } = useSidebar();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const project = useProjectStore((s) => s.project);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isCreating = useIsMutating({ mutationKey: ["createTask"] }) > 0;

  return (
    <section className="flex items-center justify-between py-4">
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
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button variant={"primary"} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Task"}
          </Button>
        </DialogTrigger>
        <CreateTaskModal onClose={() => setIsCreateOpen(false)} />
      </Dialog>
    </section>
  );
}
