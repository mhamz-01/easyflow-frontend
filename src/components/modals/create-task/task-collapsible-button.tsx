import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../shadcn/collapsible";
import { Button } from "../../shadcn/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

export default function TaskCollapsibleButton({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Collapsible className="rounded-md border">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="group">
          <PlusIcon className="h-4 w-4 group-data-[state=open]:hidden" />
          <MinusIcon className="h-4 w-4 group-data-[state=closed]:hidden" />
          {title}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 p-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
