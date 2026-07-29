"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { showcaseItems } from "../_data/showcase";
import ShowcaseItem from "./showcase-item";
import ShowcaseIconTracker from "./showcase-icon-tracker";
import ScrollReveal from "./scroll-reveal";
import type { ActionIconKey } from "../_data/action-icons";

const ShowcaseSection = () => {
  const [activeKey, setActiveKey] = useState<ActionIconKey>(showcaseItems[0].matchIcon);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // The tracker only shows while the showcase content it's tracking is
  // actually on screen — hidden the moment the wrapper scrolls out of this
  // band, so it never lingers into the next section underneath it.
  const isShowcaseActive = useInView(wrapperRef, { margin: "-35% 0px -55% 0px" });

  return (
    <section id="showcase" className="mx-auto max-w-7xl px-6 py-24">
      <ScrollReveal className="mx-auto mb-12 max-w-2xl text-center">
        <span className="text-sm font-medium text-primary-blue">Take a look inside</span>
        <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
          Built for how your team actually works
        </h2>
      </ScrollReveal>

      {/* Sticky containment is scoped to this wrapper only, tightly bounding
          the tracker + items with no trailing padding. */}
      <div ref={wrapperRef} className="relative">
        <ShowcaseIconTracker activeKey={activeKey} isVisible={isShowcaseActive} />

        <div className="mt-12 flex flex-col gap-36 sm:gap-44">
          {showcaseItems.map((item) => (
            <ShowcaseItem key={item.title} item={item} onActive={setActiveKey} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
