"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { actionIcons, type ActionIconKey } from "../_data/action-icons";
import { cn } from "@/src/lib/utils";

type ShowcaseIconTrackerProps = {
  activeKey: ActionIconKey;
  isVisible: boolean;
};

// Sticks near the top of the viewport while the showcase panels scroll past
// underneath it. The icon matching the panel currently in view gets a
// border-light — the glow itself slides between icons via a shared layoutId.
//
// The opacity/transition classes live directly on this sticky element rather
// than on a wrapping div — a CSS-transitioning ancestor breaks Chromium's
// position: sticky offset calculation for its descendants.
const ShowcaseIconTracker = ({ activeKey, isVisible }: ShowcaseIconTrackerProps) => {
  return (
    <div
      className={cn(
        "sticky top-24 z-10 flex justify-center transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Solid (not backdrop-blur) background: this panel is sticky and sits
          over scroll-scrubbed content, so a live backdrop-filter would repaint
          every scroll frame — a solid fill reads the same without the cost. */}
      <div className="flex gap-3 rounded-2xl border border-border bg-background-200/95 p-3 sm:gap-4">
        {actionIcons.map((item) => {
          const isActive = item.key === activeKey;
          const isComingSoon = item.key === "brain";

          return (
            <div
              key={item.key}
              className={cn(
                "relative flex size-12 items-center justify-center rounded-xl border bg-background-200/80 transition-colors duration-300 sm:size-14",
                isActive ? item.ring : "border-transparent",
                isComingSoon && !isActive && "opacity-40",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="showcase-active-glow"
                  className={cn("pointer-events-none absolute -inset-1 -z-10 rounded-xl blur-md", item.glow)}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Image src={item.icon} alt={item.label} className="size-5 sm:size-6" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShowcaseIconTracker;
