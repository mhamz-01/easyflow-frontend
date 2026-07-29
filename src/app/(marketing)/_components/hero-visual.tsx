"use client";

import { motion } from "framer-motion";
import AppPreviewFrame from "./app-preview-frame";
import homeImg from "@/public/images/marketing/showcase-home.jpg";

// The real workspace screenshot as the hero's centerpiece: a wide multi-color
// halo glowing from behind its top edge, a passing light sweep, and a tilted
// 3D entrance that settles into a slow continuous float.
const HeroVisual = () => {
  return (
    <div className="relative w-full">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[380px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_90deg,rgba(13,142,255,0.45),rgba(255,0,200,0.28),rgba(255,197,61,0.28),rgba(13,142,255,0.45))] blur-3xl sm:h-[460px] sm:w-[900px]"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-10 left-1/2 -z-10 h-px w-[140%] -translate-x-1/2 -rotate-6 bg-gradient-to-r from-transparent via-primary-blue/70 to-transparent"
        animate={{ x: ["-20%", "20%"], opacity: [0, 1, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
      />

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, rotateX: 7 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <AppPreviewFrame screenshotSrc={homeImg} screenshotAlt="EasyFlow workspace home" priority />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroVisual;
