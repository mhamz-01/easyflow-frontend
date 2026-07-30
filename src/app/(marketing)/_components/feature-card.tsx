"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Feature, FeatureAccent } from "../_data/features";
import { Badge } from "@/src/components/shadcn/badge";
import { cn } from "@/src/lib/utils";

const ACCENT_STYLES: Record<
  FeatureAccent,
  { chip: string; icon: string; glow: string; border: string }
> = {
  blue: {
    chip: "bg-primary-blue/10",
    icon: "text-primary-blue",
    glow: "bg-primary-blue/25",
    border: "group-hover:border-primary-blue/50",
  },
  green: {
    chip: "bg-primary-green/10",
    icon: "text-primary-green",
    glow: "bg-primary-green/25",
    border: "group-hover:border-primary-green/50",
  },
  yellow: {
    chip: "bg-primary-yellow/10",
    icon: "text-primary-yellow",
    glow: "bg-primary-yellow/25",
    border: "group-hover:border-primary-yellow/50",
  },
  pink: {
    chip: "bg-primary-pink/10",
    icon: "text-primary-pink",
    glow: "bg-primary-pink/25",
    border: "group-hover:border-primary-pink/50",
  },
};

const FeatureCard = ({
  title,
  description,
  accent,
  iconSrc,
  icon: Icon,
  badge,
  featured,
}: Feature) => {
  const styles = ACCENT_STYLES[accent];

  return (
    <motion.div
      whileHover={{ scale: 1.035 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "group relative z-0 flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-background-200 p-6 transition-colors duration-300 hover:z-20 hover:shadow-2xl",
        styles.border,
        featured && "justify-between",
      )}
    >
      {/* Hover-revealed accent glow — the card's signature bento-grid touch. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-10 -right-10 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
          styles.glow,
        )}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            "flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110",
            featured ? "size-14" : "size-11",
            styles.chip,
          )}
        >
          {iconSrc ? (
            <Image src={iconSrc} alt="" className={featured ? "size-7" : "size-5"} />
          ) : Icon ? (
            <Icon className={cn(featured ? "size-7" : "size-5", styles.icon)} />
          ) : null}
        </div>
        {badge && (
          <Badge variant="outline" className="relative text-gray-100">
            {badge}
          </Badge>
        )}
      </div>

      <div className="relative flex flex-col gap-1.5">
        <h3 className={cn("font-semibold text-foreground", featured ? "text-2xl" : "text-h1")}>
          {title}
        </h3>
        <p
          className={cn(
            "leading-relaxed text-gray-100",
            featured ? "max-w-md text-base" : "text-sm",
          )}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
