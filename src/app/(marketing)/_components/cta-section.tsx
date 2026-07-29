"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/src/components/shadcn/button";

const CtaSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <motion.div
        ref={ref}
        style={{ scale, opacity }}
        className="relative overflow-hidden rounded-2xl border border-border bg-background-200 px-8 py-16 text-center sm:px-16"
      >
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(closest-side,rgba(13,142,255,0.25),transparent)]"
        />

        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          Bring your team&apos;s work into one place
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-100">
          EasyFlow is free to use, today. Create a workspace and see how much
          lighter project management can feel.
        </p>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="primary" size="lg">
            <Link href="/sign-up">
              Get started free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
