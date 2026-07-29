"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./scroll-reveal";

const steps = [
  {
    step: "01",
    title: "Create your workspace",
    description: "Sign up free and spin up a workspace for your team in seconds — no setup required.",
  },
  {
    step: "02",
    title: "Invite your team",
    description: "Bring teammates in, assign roles, and give everyone a home for their work.",
  },
  {
    step: "03",
    title: "Organize the work",
    description: "Create projects, then fill them with tasks, docs, whiteboards, and files as you go.",
  },
  {
    step: "04",
    title: "Ship together",
    description: "Track progress in real time and see recent activity so nothing falls through the cracks.",
  },
];

const HowItWorksSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="border-t border-border bg-background-200/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-medium text-primary-blue">How it works</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            From sign-up to shipping in minutes
          </h2>
        </ScrollReveal>

        <div ref={trackRef} className="relative">
          <div aria-hidden className="pointer-events-none absolute top-3 right-0 left-0 hidden h-px bg-border lg:block" />
          <motion.div
            aria-hidden
            style={{ scaleX: lineScale }}
            className="pointer-events-none absolute top-3 right-0 left-0 hidden h-px origin-left bg-primary-blue lg:block"
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ step, title, description }, index) => (
              <ScrollReveal key={step} delay={index * 0.08} y={20} className="flex flex-col gap-3">
                <span className="text-2xl font-bold text-border">{step}</span>
                <h3 className="text-h1 font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-100">{description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
