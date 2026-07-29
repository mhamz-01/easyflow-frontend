"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Thin progress bar under the navbar tracking how far through the page the visitor has scrolled.
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-primary-blue"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgressBar;
