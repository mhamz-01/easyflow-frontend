"use client";

import { Sheet, SheetContent } from "@/src/components/shadcn/sheet";
import { Badge } from "@/src/components/shadcn/badge";
import { Separator } from "@/src/components/shadcn/separator";
import { Button } from "@/src/components/shadcn/button";
import { Checkbox } from "@/src/components/shadcn/checkbox";
import { Card, CardContent } from "@/src/components/shadcn/card";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import docsIcon from '@/public/icons/docs.svg'
import whiteboardIcon from '@/public/icons/whiteboard.svg'
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/shadcn/avatar";
import {
  Calendar,
  User as UserIcon,
  Flag,
  Link2,
  File,
  Expand,
} from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import { DialogTitle } from "@/src/components/shadcn/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTask, useUpdateTask } from "@/src/hooks/tasks";
import SelectAssignees from "@/src/components/dropdown-select/select-assignees";
import { formatDate, getFileUrl } from "@/src/lib/utils";
import TaskDetailsDrawerSkeleton from "./task-details-drawer-skeleton";
import { useState } from "react";
import AddLinkModal from "@/src/components/custom/task-drawer-buttons-popovers-dialogs/add-link-modal";
import AddChecklistModal from "@/src/components/custom/task-drawer-buttons-popovers-dialogs/add-checklist-modal";
import AddDocPopover from "@/src/components/custom/task-drawer-buttons-popovers-dialogs/add-doc-popover";
import AddWhiteboardPopover from "@/src/components/custom/task-drawer-buttons-popovers-dialogs/add-whiteboard-popover";
import DrawerCollapsibleSection from "./drawer-collapsible-section";

const TaskDetailsDrawer = () => {
  const { isOpen, taskId, setIsOpen } = useTaskStore();
  const router = useRouter();
  

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // get task by id
  const { data: task, isPending } = useTask(taskId!!);
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();


 const [pendingAction, setPendingAction] = useState
  <"link" | "checklist" | "doc" | "whiteboard" | null
>(null);

  const {
    links = [],
    assignees = [],
    attachments = [],
    checklist: rawChecklist = [],
    description = "",
    documents = [],
    whiteboards = [],
    attachedDocs = [],
    attachedWhiteboards = [],
  } = task || {};

  const checklist = rawChecklist.filter(
    (group) => group.name.trim() !== "" || group.items.some((item) => item.trim() !== "")
  );
  // ── Handlers ─────────────────────────────────────────────────────
 

const handleAddLink = (url: string) => {
  if (!taskId || !task) return;
  setPendingAction("link");
  updateTask(
    {
      taskId,
      payload: {
        links: [...(task.links ?? []), url],
        attachedDocs: task.attachedDocs ?? [],
        attachedWhiteboards: task.attachedWhiteboards ?? [],
      },
    },
    {
      onSuccess: () => {
        setIsLinkModalOpen(false);
        setPendingAction(null);
      },
      onError: () => setPendingAction(null),
    },
  );
};

const handleAddChecklist = (group: { name: string; items: string[] }) => {
  if (!taskId || !task) return;
  setPendingAction("checklist");
  updateTask(
    {
      taskId,
      payload: {
        checklist: [...(task.checklist ?? []), group],
        attachedDocs: task.attachedDocs ?? [],
        attachedWhiteboards: task.attachedWhiteboards ?? [],
      },
    },
    {
      onSuccess: () => {
        setIsChecklistModalOpen(false);
        setPendingAction(null);
      },
      onError: () => setPendingAction(null),
    },
  );
};

const handleAddDoc = (docId: number) => {
  if (!taskId || !task) return;
  setPendingAction("doc");
  updateTask(
    {
      taskId,
      payload: {
        attachedDocs: [...(task.attachedDocs ?? []), docId],
        attachedWhiteboards: task.attachedWhiteboards ?? [],
      },
    },
    {
      onSuccess: () => setPendingAction(null),
      onError: () => setPendingAction(null),
    },
  );
};

const handleAddWhiteboard = (whiteboardId: number) => {
  if (!taskId || !task) return;
  setPendingAction("whiteboard");
  updateTask(
    {
      taskId,
      payload: {
        attachedWhiteboards: [...(task.attachedWhiteboards ?? []), whiteboardId],
        attachedDocs: task.attachedDocs ?? [],
      },
    },
    {
      onSuccess: () => setPendingAction(null),
      onError: () => setPendingAction(null),
    },
  );
};
  return (
    <Sheet open={isOpen} onOpenChange={() => setIsOpen(!isOpen, null)}>
      <SheetContent
        side="right"
        className="min-w-150 bg-black text-white border-l border-neutral-800 overflow-y-auto p-5"
      >
        {isPending ? (
          <TaskDetailsDrawerSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Title */}
            <DialogTitle className="text-2xl font-semibold">
              {task?.name}
            </DialogTitle>

            <DialogDescription></DialogDescription>

            {/* Description */}
            {description && (
              <p className="text-sm text-neutral-400 leading-relaxed">
                {description}
              </p>
            )}

            {/* ── Action Buttons ── */}
            <div className="flex gap-2 flex-wrap">
              {/* Add Document */}
              <AddDocPopover
                existingDocIds={attachedDocs}
                isPending={pendingAction === "doc"}
                onSelect={handleAddDoc}
              />

              {/* Add Whiteboard */}
              <AddWhiteboardPopover
                existingWhiteboardIds={attachedWhiteboards}
                isPending={pendingAction === "whiteboard"}
                onSelect={handleAddWhiteboard}
              />

              {/* Add Link */}
              <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">Add link</Button>
                </DialogTrigger>
                <AddLinkModal
                  isPending={pendingAction === "link"}
                  onSubmit={handleAddLink}
                />
              </Dialog>

              {/* Create Checklist */}
              <Dialog open={isChecklistModalOpen} onOpenChange={setIsChecklistModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">Create checklist</Button>
                </DialogTrigger>
                <AddChecklistModal
                    isPending={pendingAction === "checklist"}
                  onSubmit={handleAddChecklist}
                />
              </Dialog>
            </div>

            <Separator className="bg-neutral-800" />

{/* Attached Documents */}
<DrawerCollapsibleSection title="Attached Documents" count={documents.length}>
  {documents.length > 0 ? (
    documents.map((doc) => (
      <div
        key={doc.id}
        className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-neutral-800 transition-colors"
        onClick={() => router.push(`docs/${doc.id}`)}
      >
        <Image src={docsIcon} alt="docs icon" width={16} height={16} />
        <span>{doc.documentName}</span>
      </div>
    ))
  ) : (
    <div
    className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-lg"
  >
    <p className="text-sm text-neutral-500 italic">
      No documents attached yet.  
    </p>
    </div>
  )}
</DrawerCollapsibleSection>


{/* Attached Whiteboards */}
<DrawerCollapsibleSection title="Attached Whiteboards" count={whiteboards.length}>
  {whiteboards.length > 0 ? (
    whiteboards.map((wb) => (
      <div
        key={wb.id}
        className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-neutral-800 transition-colors"
        onClick={() => router.push(`whiteboards/${wb.id}`)}
      >
        <Image src={whiteboardIcon} alt="whiteboard icon" width={16} height={16} />
        <span>{wb.whiteboardName}</span>
      </div>
    ))
  ) : (
    <div
    className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-lg"
  >
    <p className="text-sm text-neutral-500 italic">
      No whiteboards attached yet. 
    </p>
    </div>
  )}
</DrawerCollapsibleSection>
            <Separator className="bg-neutral-800" />

      {/* Checklist */}
<DrawerCollapsibleSection title="Checklist" count={checklist.length}>
  {checklist.length > 0 ? (
    checklist.map((group, index) => (
      <div key={index} className="space-y-2">
        <p className="text-xs text-neutral-400">{group.name}</p>
        {group.items
          .filter((item) => item.trim() !== "")
          .map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Checkbox />
              <span className="text-sm">{item}</span>
            </div>
          ))}
      </div>
    ))
  ) : (
    <div
    className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-lg text-sm "
  >
    <p className="text-neutral-500 italic">
      No checklist created yet. 
    </p>
  </div>
  )}
</DrawerCollapsibleSection>

            {/* <Separator className="bg-neutral-800" /> */}

          {/* Attachments */}
{attachments.length > 0 && (
  <DrawerCollapsibleSection title="Attachments" count={attachments.length}>
    {attachments.map((file) => {
      const fileUrl = getFileUrl(file.fileKey);
      const isImage = file.mimeType.startsWith("image/");
      return (
        <div
          key={file.id}
          className="flex items-center justify-between bg-neutral-900 px-3 py-2 rounded-lg"
        >
          <div className="flex items-center gap-3 text-sm">
            {isImage ? (
              <img
                src={fileUrl}
                alt={file.originalName}
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <File size={16} />
            )}
            <span className="truncate max-w-50">{file.originalName}</span>
          </div>
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
            <Expand size={16} className="text-neutral-400 cursor-pointer" />
          </a>
        </div>
      );
    })}
  </DrawerCollapsibleSection>
)}

            <Separator className="bg-neutral-800" />

         {/* Links */}
{links.length > 0 && (
  <DrawerCollapsibleSection title="Links" count={links.length}>
    {links.map((link, index) => (
      <div
        key={index}
        className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-lg text-sm"
      >
        <Link2 size={16} />
        <a href={link} target="_blank" className="hover:underline truncate">
          {link}
        </a>
      </div>
    ))}
  </DrawerCollapsibleSection>
)}

            {/* Meta Card */}
            <Card className="bg-neutral-900 border-neutral-800 rounded-2xl mt-8">
              <CardContent className="p-6 space-y-5 text-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Calendar size={16} />
                    State
                  </div>
                  <Badge className="bg-orange-500 text-black">{task?.state}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <UserIcon size={16} />
                    Assignees
                  </div>
                  <SelectAssignees
                    selectedIds={assignees.map((assignee) => assignee.id)}
                    onSelect={() => console.log("clicked")}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Flag size={16} />
                    Priority
                  </div>
                  <Badge className="bg-yellow-600 text-black">{task?.priority}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Created by</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={task?.creator.imageUrl} />
                      <AvatarFallback>{task?.creator.username[0]}</AvatarFallback>
                    </Avatar>
                    {task?.creator.username}
                  </div>
                </div>

                <div className="flex justify-between">
  <span className="text-neutral-400">Start Date</span>
  <span className={task?.startDate ? "" : "text-neutral-500 italic"}>
    {task?.startDate ? formatDate(task.startDate) : "Not mentioned"}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-neutral-400">End Date</span>
  <span className={task?.dueDate ? "text-red-500" : "text-neutral-500 italic"}>
    {task?.dueDate ? formatDate(task.dueDate) : "Not mentioned"}
  </span>
</div>
              </CardContent>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsDrawer;