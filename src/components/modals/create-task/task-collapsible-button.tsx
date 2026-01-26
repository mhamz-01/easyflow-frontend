"use client";

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
  Icon?: React.ElementType; // Lucide icon OR Next.js image
  img?: StaticImageData; // Lucide icon OR Next.js image
  iconClassNames?: string;
  children: React.ReactNode;
};

export default function TaskCollapsibleButton({
  title,
  Icon,
  img,
  iconClassNames,
  children,
}: TaskCollapsibleButtonProps) {
  return (
    <Collapsible className="rounded-md border data-[state=open]:bg-muted data-[state=open]:border-muted-foreground/40">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="group flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className={cn("h-4 w-4", iconClassNames)} />}
            {img && (
              <Image
                src={img}
                alt={title}
                className="h-4 w-4 object-contain"
                width={16}
                height={16}
              />
            )}
            <span>{title}</span>
          </div>
          <PlusIcon className="h-4 w-4 group-data-[state=open]:hidden" />
          <MinusIcon className="h-4 w-4 group-data-[state=closed]:hidden" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 p-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
