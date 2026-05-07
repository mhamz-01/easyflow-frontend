"use client";

import { Sheet, SheetContent } from "@/src/components/shadcn/sheet";
import { Badge } from "@/src/components/shadcn/badge";
import { Separator } from "@/src/components/shadcn/separator";
import { Button } from "@/src/components/shadcn/button";
import { Checkbox } from "@/src/components/shadcn/checkbox";
import { Card, CardContent } from "@/src/components/shadcn/card";
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
import { useTask } from "@/src/hooks/tasks";
import SelectAssignees from "@/src/components/dropdown-select/select-assignees";
import { formatDate, getFileUrl } from "@/src/lib/utils";
import TaskDetailsDrawerSkeleton from "./task-details-drawer-skeleton";

const TaskDetailsDrawer = () => {
  const { isOpen, taskId, setIsOpen } = useTaskStore();

  // get task by id
  const { data: task, isPending } = useTask(taskId!!);

  const {
    links = [],
    assignees = [],
    attachments = [],
    checklist = [],
    description = "",
  } = task || {};

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

            {/* for accessibilty */}
            <DialogDescription></DialogDescription>

            {/* Description */}
            {description && (
              <p className="text-sm text-neutral-400 leading-relaxed">
                {description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline">
                Add document
              </Button>
              <Button size="sm" variant="outline">
                Add whiteboard
              </Button>
              <Button size="sm" variant="outline">
                Add link
              </Button>
              <Button size="sm" variant="outline">
                Create checklist
              </Button>
            </div>

            <Separator className="bg-neutral-800" />

            {/* Checklist (Grouped) */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-300">
                Checklist
              </h3>

              {checklist.map((group, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-xs text-neutral-400">{group.name}</p>

                  {group.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Checkbox />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <Separator className="bg-neutral-800" />

            {/* Attachments */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">
                Attachments
              </h3>

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

                      <span className="truncate max-w-50">
                        {file.originalName}
                      </span>
                    </div>

                    <a
                      href={fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Expand
                        size={16}
                        className="text-neutral-400 cursor-pointer"
                      />
                    </a>
                  </div>
                );
              })}
            </div>

            <Separator className="bg-neutral-800" />

            {/* Links */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">Links</h3>

              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-lg text-sm"
                >
                  <Link2 size={16} />
                  <a href={link} target="_blank" className="hover:underline">
                    {link}
                  </a>
                </div>
              ))}
            </div>

            {/* Meta Card */}
            <Card className="bg-neutral-900 border-neutral-800 rounded-2xl mt-8">
              <CardContent className="p-6 space-y-5 text-sm">
                {/* State */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Calendar size={16} />
                    State
                  </div>
                  <Badge className="bg-orange-500 text-black">
                    {task?.state}
                  </Badge>
                </div>

                {/* Assignees */}
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

                {/* Priority */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Flag size={16} />
                    Priority
                  </div>
                  <Badge className="bg-yellow-600 text-black">
                    {task?.priority}
                  </Badge>
                </div>

                {/* Created By */}
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Created by</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={task?.creator.imageUrl} />
                      <AvatarFallback>
                        {task?.creator.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    {task?.creator.username}
                  </div>
                </div>

                {/* Dates */}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Start Date</span>
                  {/* <span className="text-green-500">{task?.startDate}</span> */}
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">End Date</span>
                  <span className="text-red-500">
                    {task?.dueDate && formatDate(task.dueDate)}
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
