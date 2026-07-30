"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/shadcn/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

type DrawerCollapsibleSectionProps = {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function DrawerCollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
}: DrawerCollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setIsAnimating(true);
      }}
    >
      <CollapsibleTrigger asChild>
        <button type="button" className="group flex items-center gap-2 w-full text-left">
          <ChevronRight
            size={16}
            className="text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90"
          />
          <h3 className="text-sm font-medium text-foreground">
            {title} <span className="text-muted-foreground">({count})</span>
          </h3>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent
        onAnimationEnd={() => setIsAnimating(false)}
        className={cn(
          "collapsible-content space-y-3 pl-6 pt-2",
          isAnimating ? "overflow-hidden" : "overflow-visible"
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}