"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn/popover";
import { Button } from "@/src/components/shadcn/button";
import { Spinner } from "@/src/components/shadcn/spinner";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllWhiteboards } from "@/src/lib/api/whiteboards/services";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import { Check, Search } from "lucide-react";
import Image from "next/image";
import whiteboardIcon from "@/public/icons/whiteboard.svg";

interface AddWhiteboardPopoverProps {
  existingWhiteboardIds: number[];
  isPending: boolean;
  onSelect: (whiteboardId: number) => void;
}

const AddWhiteboardPopover = ({
  existingWhiteboardIds,
  isPending,
  onSelect,
}: AddWhiteboardPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const workspace = useWorkspaceStore((s) => s.workspace);
  const project = useProjectStore((s) => s.project);

  const { data } = useQuery({
    queryKey: ["whiteboards", workspace?.id, project?.id],
    queryFn: () =>
      getAllWhiteboards({ workspaceId: workspace!.id, projectId: project!.id }),
    enabled: !!workspace?.id && !!project?.id,
  });

  const filtered = useMemo(
    () =>
      (data?.whiteboards ?? []).filter((wb) =>
        wb.whiteboardName.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" disabled={isPending}>
          {isPending ? <Spinner /> : "Add whiteboard"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="flex items-center gap-2 border rounded-md px-2 mb-2">
          <Search size={14} className="text-muted-foreground" />
          <input
            className="flex-1 py-1.5 text-sm bg-transparent outline-none"
            placeholder="Search whiteboards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-3 text-center">
              No whiteboards found
            </p>
          )}
          {filtered.map((wb) => {
            const already = existingWhiteboardIds.includes(wb.id);
            return (
              <button
                key={wb.id}
                disabled={already}
                onClick={() => {
                  onSelect(wb.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors
                  ${already
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted cursor-pointer"
                  }`}
              >
                <Image src={whiteboardIcon} width={14} height={14} alt="whiteboard" />
                <span className="truncate flex-1">{wb.whiteboardName}</span>
                {already && <Check size={14} className="text-green-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddWhiteboardPopover;