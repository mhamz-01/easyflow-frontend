import tasksIcon from "@/public/icons/tasks.svg";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import docsIcon from "@/public/icons/docs.svg";
import { BellRing, Blocks, User, Users } from "lucide-react";

export const projectSubItems = [
  {
    icon: tasksIcon,
    name: "Tasks",
    type: "tasks",
  },
  {
    icon: whiteboardIcon,
    name: "Whiteboards",
    type: "whiteboards",
  },
  {
    icon: docsIcon,
    name: "Documents",
    type: "docs",
  },
];

// account menu items
export const accountMenuItems = [
  {
    title: "Profile",
    url: "profile",
    icon: User,
  },
  {
    title: "Notifications",
    url: "notifications",
    icon: BellRing,
  },
];

// workspace menu items
export const workspaceMenuItems = [
  {
    title: "General",
    url: "general",
    icon: Blocks,
  },
  {
    title: "Members",
    url: "members",
    icon: Users,
  },
];
