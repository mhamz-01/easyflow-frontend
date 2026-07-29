"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import AppPreviewFrame from "./app-preview-frame";
import type { ShowcaseItem as ShowcaseItemType } from "../_data/showcase";
import type { ActionIconKey } from "../_data/action-icons";

type ShowcaseItemProps = {
  item: ShowcaseItemType;
  onActive?: (key: ActionIconKey) => void;
};

// The image grows, rises, and sharpens into focus as it scrolls up through
// the viewport — a continuous scrub tied to scroll position, not a one-shot reveal.
const ShowcaseItem = ({ item, onActive }: ShowcaseItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.3"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);

  // Fires while this panel occupies the center band of the viewport, so the
  // icon tracker can highlight the matching icon as the user scrolls through it.
  const isCentered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (isCentered) onActive?.(item.matchIcon);
  }, [isCentered, item.matchIcon, onActive]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span className="text-sm font-medium text-primary-blue">{item.eyebrow}</span>
      <h3 className="mt-3 max-w-xl text-2xl font-bold text-foreground sm:text-3xl">
        {item.title}
      </h3>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-100">
        {item.description}
      </p>

      <motion.div style={{ scale, y, opacity }} className="mt-10 w-full max-w-5xl">
        <AppPreviewFrame screenshotSrc={item.image} screenshotAlt={item.title} fit="contain" />
      </motion.div>
    </div>
  );
};

export default ShowcaseItem;
