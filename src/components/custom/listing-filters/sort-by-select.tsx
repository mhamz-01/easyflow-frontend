"use client";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/src/components/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn/popover";
import { Calendar } from "@/src/components/shadcn/calendar";
import { ChevronDown, ListFilter, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../shadcn/button";
import { Checkbox } from "../../shadcn/checkbox";
import { Label } from "../../shadcn/label";
import Avatar from "../avatar";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceMembers } from "@/src/lib/api/workspace/members/services";
import { DateRange } from "react-day-picker";

export type PresetFilter = "today" | "last-7" | "last-30" | "last-3-months";

export type DateFilter = {
  preset: PresetFilter | null;
  range: DateRange | null;
};

interface SortBySelectProps {
  dateFilter?: DateFilter;
  onDateFilterChange?: (value: DateFilter) => void;
  selectedMembers?: number[];
  onMemberToggle?: (memberId: number) => void;
}

const PRESETS: { id: PresetFilter; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "last-7", label: "Last 7 days" },
  { id: "last-30", label: "Last 30 days" },
  { id: "last-3-months", label: "Last 3 months" },
];

const SortBySelect = ({
  dateFilter = { preset: null, range: null },
  onDateFilterChange = () => {},
  selectedMembers = [],
  onMemberToggle = () => {},
}: SortBySelectProps) => {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);

  const { data: membersData } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers({ workspaceId: workspaceId! }),
    enabled: !!workspaceId,
  });

  const handlePresetToggle = (preset: PresetFilter) => {
    const isActive = dateFilter.preset === preset;
    onDateFilterChange({
      preset: isActive ? null : preset,
      range: null,
    });
    setShowCalendar(false);
  };

  const handleRangeChange = (range: DateRange | undefined) => {
    onDateFilterChange({
      preset: null,
      range: range ?? null,
    });
  };

  const handleClearDate = () => {
    onDateFilterChange({ preset: null, range: null });
    setShowCalendar(false);
  };

  const hasDateFilter = dateFilter.preset !== null || dateFilter.range !== null;
  const activeFilterCount = (hasDateFilter ? 1 : 0) + selectedMembers.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <ListFilter />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent sideOffset={8} className="">
        <Command>
          <CommandList>
            {/* ── Created Date ── */}
            <CommandGroup heading="Created Date">
              {PRESETS.map((preset) => (
                <CommandItem
                  key={preset.id}
                  onSelect={() => handlePresetToggle(preset.id)}
                >
                  <Checkbox
                    id={preset.id}
                    checked={dateFilter.preset === preset.id}
                    onCheckedChange={() => handlePresetToggle(preset.id)}
                  />
                  <Label htmlFor={preset.id} className="cursor-pointer">
                    {preset.label}
                  </Label>
                </CommandItem>
              ))}

              {/* ✅ Custom range toggle — just the row, no calendar inside Command */}
              <CommandItem onSelect={() => setShowCalendar((prev) => !prev)}>
                <Checkbox
                  id="custom"
                  checked={dateFilter.range !== null}
                  onCheckedChange={() => setShowCalendar((prev) => !prev)}
                />
                <Label htmlFor="custom" className="cursor-pointer">
                  Custom range
                </Label>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            {/* ── Created By ── */}
            <CommandGroup heading="Created By">
              {membersData?.members.map((member) => (
                <CommandItem
                  key={member.User.id}
                  onSelect={() => onMemberToggle(member.User.id)}
                >
                  <Checkbox
                    id={`member-${member.User.id}`}
                    checked={selectedMembers.includes(member.User.id)}
                    onCheckedChange={() => onMemberToggle(member.User.id)}
                  />
                  <Avatar width={20} height={20} />
                  <Label
                    htmlFor={`member-${member.User.id}`}
                    className="cursor-pointer"
                  >
                    {member.User.username}
                  </Label>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        {/* ✅ Calendar fully outside Command — clicks work properly */}
        {showCalendar && (
          <div className="border-t">
            <Calendar
              mode="range"
              selected={dateFilter.range ?? undefined}
              onSelect={handleRangeChange}
              disabled={{ after: new Date() }}
              numberOfMonths={1}
            />
            {dateFilter.range && (
              <div className="px-3 pb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={handleClearDate}
                >
                  <X size={13} className="mr-1" />
                  Clear date
                </Button>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SortBySelect;