"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../shadcn/collapsible";
import { Button } from "../../shadcn/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/src/lib/utils";

type TaskCollapsibleButtonProps = {
  title: string;
  Icon?: React.ElementType;
  img?: StaticImageData;
  badgeCount?: number;
  iconClassNames?: string;
  children: React.ReactNode;
};

export default function TaskCollapsibleButton({
  title,
  Icon,
  img,
  iconClassNames,
  badgeCount,
  children,
}: TaskCollapsibleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setIsAnimating(true);
      }}
      className="rounded-md border data-[state=open]:bg-muted data-[state=open]:border-muted-foreground/40"
    >
       <CollapsibleTrigger asChild>
        <Button variant="ghost" className="group flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {Icon && <Icon className={cn("h-4 w-4", iconClassNames)} />}
            {img && (
              <Image src={img} alt={title} className="h-4 w-4 object-contain" width={16} height={16} />
            )}
            <span>{title}</span>
            {!!badgeCount && (
              <span className="rounded-full bg-primary/10 text-primary text-xs font-medium px-2 py-0.5">
                {badgeCount}
              </span>
            )}
          </div>
          <PlusIcon className="h-4 w-4 group-data-[state=open]:hidden" />
          <MinusIcon className="h-4 w-4 group-data-[state=closed]:hidden" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        onAnimationEnd={() => setIsAnimating(false)}
        className={cn(
          "collapsible-content space-y-3 p-3",
          isAnimating ? "overflow-hidden" : "overflow-visible"
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}