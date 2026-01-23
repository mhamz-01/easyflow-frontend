"use client";
import { useState } from "react";
import {
  SidebarTrigger,
  useSidebar,
} from "../../../../../components/shadcn/sidebar";
import Breadcrumbs from "../../../../../components/custom/breadcrumbs";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { useAuth } from "@clerk/nextjs";
import { Ellipsis, Maximize, Users, X } from "lucide-react";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import { Button } from "@/src/components/shadcn/button";
import CreateTaskModal from "@/src/components/modals/create-task";

// This header will be used for docs, whiteboards and tasks page
export function TasksHeader() {
  const { open } = useSidebar();
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const projectId = useProjectStore((s) => s.project?.id);
  const { userId } = useAuth();

  // local states
  const [docType, setDocType] = useState("");

  return (
    <section className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        {/* Only show the SidebarTrigger if the sidebar is closed && it is mobile view */}
        {<SidebarTrigger className={!open ? "" : "md:hidden"} />}
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Project name", path: "/" },
            { label: "Task", path: "" },
          ]}
        />
      </div>
      {docType !== "opened"}
      {/* actions when doc | whitboard | task is open */}
      {docType === "opened" ? (
        <div className="flex items-center gap-5 border-2 overflow-hidden p-3 rounded-2xl">
          <Users size={18} />
          <span>share</span>
          <Ellipsis size={18} />
          <Maximize size={18} />
          <X size={18} />
        </div>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"primary"}>Create Task</Button>
          </DialogTrigger>
          <CreateTaskModal />
        </Dialog>
      )}
    </section>
  );
}
