import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";
import { Users, HardDrive, StickyNote, Activity } from "lucide-react";
import docsIcon from "@/public/icons/docs.svg";
import tasksIcon from "@/public/icons/tasks.svg";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import brainIcon from "@/public/icons/brain.svg";

export type FeatureAccent = "blue" | "green" | "yellow" | "pink";

export type Feature = {
  title: string;
  description: string;
  accent: FeatureAccent;
  iconSrc?: StaticImageData;
  icon?: LucideIcon;
  badge?: string;
  // Bento grid span on large screens — 2 columns wide, or the default 1.
  span?: 1 | 2;
};

export const features: Feature[] = [
  {
    title: "Projects & Tasks",
    description:
      "Break work into projects and tasks, track status and due dates, and see exactly what's next without digging through threads.",
    accent: "green",
    iconSrc: tasksIcon,
    span: 2,
  },
  {
    title: "Docs",
    description:
      "Write specs, notes, and wikis in a real-time rich text editor that lives right next to the work it describes.",
    accent: "blue",
    iconSrc: docsIcon,
  },
  {
    title: "Whiteboards",
    description:
      "Sketch flows, map ideas, and brainstorm together on an infinite collaborative canvas built into every project.",
    accent: "yellow",
    iconSrc: whiteboardIcon,
  },
  {
    title: "Sticky Notes",
    description:
      "Capture a quick thought or reminder without opening a doc or creating a task. Small ideas deserve a fast home too.",
    accent: "pink",
    icon: StickyNote,
  },
  {
    title: "File Storage",
    description:
      "Attach files straight to a project and pull them back up instantly — no more hunting through chat history.",
    accent: "blue",
    icon: HardDrive,
  },
  {
    title: "Team Workspaces",
    description:
      "Invite your team, assign roles, and keep every project, doc, and board organized under one shared workspace.",
    accent: "green",
    icon: Users,
    span: 2,
  },
  {
    title: "Recent Activity",
    description:
      "See what changed and who did it the moment it happens, so nothing important slips past your team.",
    accent: "yellow",
    icon: Activity,
    span: 2,
  },
  {
    title: "AI Assistant",
    description:
      "Draft docs, summarize activity, and get unstuck faster with an AI teammate built into your workspace.",
    accent: "pink",
    iconSrc: brainIcon,
    badge: "Coming soon",
    span: 2,
  },
];
