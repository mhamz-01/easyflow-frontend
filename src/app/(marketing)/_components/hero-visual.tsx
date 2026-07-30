"use client";

import { motion, useReducedMotion } from "framer-motion";
import AppPreviewFrame from "./app-preview-frame";
import homeImg from "@/public/images/marketing/showcase-home.jpg";

// The real workspace screenshot as the hero's centerpiece: a static halo
// behind its top edge and a one-shot fade/slide-up entrance, held flat
// (no tilt, no continuous float/pulse). The only ongoing motion is the
// scroll-linked parallax applied by the parent (HeroSection) — that's
// enough movement on its own; stacking infinite loops on top of it read
// as jitter rather than polish, and cost real compositing time on a
// section that has to feel instant.
const HeroVisual = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[380px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_90deg,rgba(13,142,255,0.45),rgba(255,0,200,0.28),rgba(255,197,61,0.28),rgba(13,142,255,0.45))] blur-2xl sm:h-[460px] sm:w-[900px]"
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <AppPreviewFrame
          screenshotSrc={homeImg}
          screenshotAlt="EasyFlow workspace home"
          priority
          sizes="(min-width: 1280px) 1152px, 100vw"
        />
      </motion.div>
    </div>
  );
};

export default HeroVisual;
