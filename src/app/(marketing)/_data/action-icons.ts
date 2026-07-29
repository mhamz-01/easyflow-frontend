import type { StaticImageData } from "next/image";
import whiteboardIcon from "@/public/icons/whiteboard.svg";
import docsIcon from "@/public/icons/docs.svg";
import tasksIcon from "@/public/icons/tasks.svg";
import brainIcon from "@/public/icons/brain.svg";

export type ActionIconKey = "whiteboard" | "docs" | "tasks" | "brain";

export type ActionIcon = {
  key: ActionIconKey;
  label: string;
  icon: StaticImageData;
  ring: string;
  glow: string;
};

// Shared between the hero's floating icon row and the showcase's scroll-synced
// tracker, so both stay visually identical without duplicating the icon set.
export const actionIcons: ActionIcon[] = [
  { key: "whiteboard", label: "Whiteboard", icon: whiteboardIcon, ring: "border-primary-yellow/60", glow: "bg-primary-yellow/50" },
  { key: "docs", label: "Docs", icon: docsIcon, ring: "border-primary-blue/60", glow: "bg-primary-blue/50" },
  { key: "tasks", label: "Tasks", icon: tasksIcon, ring: "border-primary-green/60", glow: "bg-primary-green/50" },
  { key: "brain", label: "Brain", icon: brainIcon, ring: "border-primary-pink/60", glow: "bg-primary-pink/50" },
];
