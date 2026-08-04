"use client";

import { motion } from "framer-motion";

const DOTS = [
  { color: "var(--primary-blue)", delay: 0 },
  { color: "var(--primary-pink)", delay: 0.2 },
  { color: "var(--primary-yellow)", delay: 0.4 },
  { color: "var(--primary-green)", delay: 0.6 },
];

type GlobalLoaderProps = {
  // Optional status line under the wordmark, e.g. "Setting up your account…"
  // — lets callers narrate a multi-step background process instead of
  // leaving the visitor staring at a bare spinner.
  message?: string;
};

// Full-screen loading state shown while the app resolves auth/workspace
// state before routing the visitor somewhere — used at the home gate and
// anywhere else that needs a top-level "figuring things out" screen.
//
// Four brand-color dots pulse around a slowly spinning ring instead of a
// static logo mark — reads as "working" rather than just sitting there.
const GlobalLoader = ({ message }: GlobalLoaderProps) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-background">
      <motion.div
        className="relative size-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        {DOTS.map((dot, i) => (
          <div
            key={dot.color}
            className="absolute inset-0"
            style={{ transform: `rotate(${i * 90}deg)` }}
          >
            <motion.span
              className="absolute top-0 left-1/2 size-3 -translate-x-1/2 rounded-full"
              style={{ backgroundColor: dot.color }}
              animate={{ scale: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: dot.delay,
              }}
            />
          </div>
        ))}
      </motion.div>

      <div className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Easy<span className="text-primary-blue">Flow</span>
        </h1>

        <div className="h-0.5 w-28 overflow-hidden rounded-full bg-background-200">
          <motion.div
            className="h-full w-1/3 rounded-full bg-primary-blue"
            animate={{ x: ["-120%", "320%"] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default GlobalLoader;
