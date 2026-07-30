import type { StaticImageData } from "next/image";
import type { ActionIconKey } from "./action-icons";
import whiteboardImg from "@/public/images/marketing/showcase-whiteboard.jpg";
import docsImg from "@/public/images/marketing/showcase-docs.png";
import taskDetailImg from "@/public/images/marketing/showcase-task-detail.png";

export type ShowcaseItem = {
  matchIcon: ActionIconKey;
  eyebrow: string;
  title: string;
  description: string;
  image: StaticImageData;
};

// Each item lines up with one of the hero's action icons — the tracker in
// ShowcaseSection lights that icon up while its panel is in view.
export const showcaseItems: ShowcaseItem[] = [
  {
    matchIcon: "whiteboard",
    eyebrow: "Whiteboards",
    title: "Think out loud, together",
    description:
      "An infinite canvas for mapping flows, sketching schemas, and brainstorming in real time — no separate tool, no context switch.",
    image: whiteboardImg,
  },
  {
    matchIcon: "docs",
    eyebrow: "Docs",
    title: "Write it down, right where the work happens",
    description:
      "A real-time rich text editor for specs, notes, and wikis — living next to the projects they describe, not buried in another tab.",
    image: docsImg,
  },
  {
    matchIcon: "tasks",
    eyebrow: "Tasks",
    title: "Every detail, right where you need it",
    description:
      "Assignees, due dates, subtasks, and comments — all on one task view, so nothing gets lost chasing context in a separate thread.",
    image: taskDetailImg,
  },
];
