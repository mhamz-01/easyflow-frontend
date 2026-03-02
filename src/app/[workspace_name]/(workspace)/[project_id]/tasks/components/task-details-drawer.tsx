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
  Download,
} from "lucide-react";
import { Task, useTaskStore } from "../store/useTaskStore";
import { DialogTitle } from "@/src/components/shadcn/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

const dummyTask: Task = {
  id: 1,
  code: "TRI-321",
  name: "Create WebMockup",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  state: "To Be Done",
  priority: "Medium",
  startDate: "19/1/2025",
  dueDate: "25/1/2025",
  endDate: "30/1/2025",

  assignees: [{ id: 1, name: "Afaq Ali", avatar: "" }],

  createdBy: {
    id: 2,
    name: "Muhammad Hamza",
    avatar: "",
  },

  checklist: [
    {
      name: "Design Phase",
      items: ["Create wireframe", "Design mockups"],
    },
    {
      name: "Development Phase",
      items: ["Setup layout", "Integrate components"],
    },
  ],

  attachments: [
    { id: 1, orignalName: "File.jpg", fileKey: "file-key-1" },
    { id: 2, orignalName: "Mockup.png", fileKey: "file-key-2" },
  ],

  links: ["https://www.trithreads.com", "https://www.google.com"],

  createdAt: "",
  updatedAt: "",
};

const TaskDetailsDrawer = () => {
  const { isOpen, setIsOpen } = useTaskStore();
  const task = dummyTask;

  const {
    links = [],
    assignees = [],
    attachments = [],
    checklist = [],
    description = "",
  } = task;

  return (
    <Sheet open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <SheetContent
        side="right"
        className="min-w-150 bg-black text-white border-l border-neutral-800 overflow-y-auto p-5"
      >
        <div className="space-y-6">
          {/* Title */}
          <DialogTitle className="text-2xl font-semibold">
            {task.name}
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
            <h3 className="text-sm font-medium text-neutral-300">Checklist</h3>

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

            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-neutral-900 px-3 py-2 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm">
                  <File size={16} />
                  {file.orignalName}
                </div>

                <Download
                  size={16}
                  className="text-neutral-400 cursor-pointer"
                />
              </div>
            ))}
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
                <Badge className="bg-orange-500 text-black">{task.state}</Badge>
              </div>

              {/* Assignees */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-neutral-400">
                  <UserIcon size={16} />
                  Assignees
                </div>

                <div className="flex items-center gap-2">
                  {assignees.map((user) => (
                    <Avatar key={user.id} className="h-7 w-7">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Flag size={16} />
                  Priority
                </div>
                <Badge className="bg-yellow-600 text-black">
                  {task.priority}
                </Badge>
              </div>

              {/* Created By */}
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Created by</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={task.createdBy.avatar} />
                    <AvatarFallback>{task.createdBy.name[0]}</AvatarFallback>
                  </Avatar>
                  {task.createdBy.name}
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between">
                <span className="text-neutral-400">Start Date</span>
                <span className="text-green-500">{task.startDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-400">End Date</span>
                <span className="text-red-500">{task.endDate}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsDrawer;
