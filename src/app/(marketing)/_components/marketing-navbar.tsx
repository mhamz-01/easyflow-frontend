"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import logo from "@/public/images/logo.png";
import { Button } from "@/src/components/shadcn/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/shadcn/sheet";
import ScrollProgressBar from "./scroll-progress-bar";
import { cn } from "@/src/lib/utils";

const NAV_LINKS = [
  { href: "#showcase", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

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
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <Link href="/" className="flex items-center gap-2 justify-self-start">
          <Image src={logo} alt="EasyFlow" className="h-7 w-auto" priority />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Easy<span className="text-primary-blue">Flow</span>
          </span>
        </Link>

        {/* True-centered regardless of how wide the logo/buttons blocks are,
            since the flanking grid columns share the remaining space equally. */}
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

        <div className="flex items-center justify-self-end gap-2">
          {/* Desktop auth actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="primary" size="sm">
              <Link href="/sign-up">Get started free</Link>
            </Button>
          </div>

          {/* Mobile: compact CTA + menu trigger opening a full nav sheet */}
          <div className="flex items-center gap-2 md:hidden">
            <Button asChild variant="primary" size="sm">
              <Link href="/sign-up">Get started</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-4/5 sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <Image src={logo} alt="EasyFlow" className="h-6 w-auto" />
                    <span>
                      Easy<span className="text-primary-blue">Flow</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1 px-4">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <a
                        href={link.href}
                        className="rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                  <SheetClose asChild>
                    <Button asChild variant="outline" size="lg" className="w-full">
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild variant="primary" size="lg" className="w-full">
                      <Link href="/sign-up">Get started free</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default MarketingNavbar;
