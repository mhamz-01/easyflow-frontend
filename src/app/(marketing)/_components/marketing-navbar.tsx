"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import logo from "@/public/images/logo.png";
import { Button } from "@/src/components/shadcn/button";
import ScrollProgressBar from "./scroll-progress-bar";
import { cn } from "@/src/lib/utils";

// Once the visitor scrolls past the hero, the navbar slides away and the
// showcase section's icon tracker takes over the top slot instead (see
// ShowcaseIconTracker) — the two hand off the "top of viewport" role rather
// than both fighting for it.
const MarketingNavbar = () => {
  const [pastHero, setPastHero] = useState(false);
  const heroHeightRef = useRef(Infinity);
  const { scrollY } = useScroll();

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const observer = new ResizeObserver(([entry]) => {
      heroHeightRef.current = entry.contentRect.height;
    });
    observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setPastHero(latest > heroHeightRef.current - 80);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur",
        pastHero && "pointer-events-none",
      )}
      animate={{ y: pastHero ? "-100%" : "0%", opacity: pastHero ? 0 : 1 }}
      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <ScrollProgressBar />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="EasyFlow" className="h-7 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-gray-100 md:flex">
          <a href="#showcase" className="transition-colors hover:text-foreground">
            Product
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/sign-up">Get started free</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default MarketingNavbar;
