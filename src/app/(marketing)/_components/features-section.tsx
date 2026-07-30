"use client";

import { features } from "../_data/features";
import FeatureCard from "./feature-card";
import ScrollReveal from "./scroll-reveal";
import { cn } from "@/src/lib/utils";

const FeaturesSection = () => {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-sm font-medium text-primary-blue">Everything in one place</span>
        <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
          Stop switching tabs to get work done
        </h2>
        <p className="mt-4 text-base text-gray-100">
          Projects, tasks, docs, whiteboards, and files — EasyFlow keeps your
          whole team working from the same source of truth.
        </p>
      </ScrollReveal>

      {/* Bento grid: a featured 2x2 hero tile, a mix of 1- and 2-wide tiles,
          and a full-width banner for the AI card — fixed row height on lg so
          the spans tile cleanly. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[190px] lg:grid-cols-4">
        {features.map((feature, index) => (
          <ScrollReveal
            key={feature.title}
            delay={(index % 4) * 0.08}
            y={20}
            className={cn(
              feature.span === 2 && "sm:col-span-2",
              feature.span === 4 && "sm:col-span-2 lg:col-span-4",
              feature.featured && "lg:row-span-2",
            )}
          >
            <FeatureCard {...feature} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
