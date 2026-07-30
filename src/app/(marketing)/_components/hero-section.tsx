"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/src/components/shadcn/button";
import { Badge } from "@/src/components/shadcn/badge";
import HeroVisual from "./hero-visual";

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section id="hero" ref={heroRef} className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(closest-side,rgba(13,142,255,0.12),transparent)]"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
        <Badge variant="outline" className="animate-in fade-in slide-in-from-bottom-2 duration-500 border-primary-blue/30 text-primary-blue">
          Free to use — no credit card required
        </Badge>

        <h1 className="animate-in fade-in slide-in-from-bottom-3 mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground duration-700 sm:text-5xl md:text-6xl">
          One workspace for every project, doc, and idea.
        </h1>

        <p className="animate-in fade-in slide-in-from-bottom-3 mt-6 max-w-2xl text-base text-gray-100 duration-700 sm:text-lg">
          EasyFlow brings your projects, tasks, docs, whiteboards, and files
          into one clean workspace — so your team spends less time switching
          tools and more time shipping.
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-3 mt-8 flex flex-col gap-3 duration-700 sm:flex-row">
          <Button asChild variant="primary" size="lg">
            <Link href="/sign-up">
              Get started free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#showcase">See how it works</a>
          </Button>
        </div>

        <motion.div style={{ y, scale, opacity }} className="mt-16 w-full">
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
