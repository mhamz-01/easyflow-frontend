"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { actionIcons, type ActionIconKey } from "../_data/action-icons";
import { cn } from "@/src/lib/utils";

type ShowcaseIconTrackerProps = {
  activeKey: ActionIconKey;
  isVisible: boolean;
};

// Sticks flush to the top of the viewport — taking over the slot the navbar
// vacates once it slides away past the hero (see MarketingNavbar) — while
// the showcase panels scroll past underneath it. The icon matching the panel
// currently in view gets a border-light — the glow itself slides between
// icons via a shared layoutId.
//
// The sticky positioning lives on this outer element; the slide/fade
// transition lives on the inner panel instead of here — a CSS-transitioning
// ancestor breaks Chromium's position: sticky offset calculation for its
// descendants.
const ShowcaseIconTracker = ({ activeKey, isVisible }: ShowcaseIconTrackerProps) => {
  return (
    <div
      className={cn(
        "sticky top-0 z-40 flex justify-center pt-4",
        isVisible ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Solid (not backdrop-blur) background: this panel is sticky and sits
          over scroll-scrubbed content, so a live backdrop-filter would repaint
          every scroll frame — a solid fill reads the same without the cost. */}
      <motion.div
        className="flex gap-3 rounded-2xl border border-border bg-background-200/95 p-3 shadow-lg sm:gap-4"
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -16 }}
        transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
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
      </motion.div>
    </div>
  );
};

export default ShowcaseIconTracker;
