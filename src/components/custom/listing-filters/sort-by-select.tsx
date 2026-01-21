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
import { ChevronDown, ListFilter } from "lucide-react";
import { useState } from "react";
import { Button } from "../../shadcn/button";
import { Checkbox } from "../../shadcn/checkbox";
import { Label } from "../../shadcn/label";
import Avatar from "../avatar";

const SortBySelect = () => {
  const [open, setOpen] = useState(false);

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
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8} className="">
        <Command>
          <CommandList>
            <CommandItem>
              <Checkbox id="favorites" />
              <Label htmlFor="favorites">Favorites</Label>
            </CommandItem>
            <CommandGroup heading="Created Date">
              <CommandItem>
                <Checkbox id="1-week" />
                <Label htmlFor="1-week">One week ago</Label>
              </CommandItem>
              <CommandItem>
                <Checkbox id="2-week" />
                <Label htmlFor="2-week">Two weeks ago</Label>
              </CommandItem>
              <CommandItem>
                <Checkbox id="1-month" />
                <Label htmlFor="1-month">One month ago</Label>
              </CommandItem>
              <CommandItem>
                <Checkbox id="custom" />
                <Label htmlFor="custom">Custom</Label>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Created By">
              <CommandItem>
                <Checkbox id="you" />
                <Avatar />
                <Label htmlFor="you">You</Label>
              </CommandItem>
              <CommandItem>
                <Checkbox id="member-1" />
                <Avatar />
                <Label htmlFor="member-1">Hamza</Label>
              </CommandItem>
              <CommandItem>
                <Checkbox id="member-2" />
                <Avatar />
                <Label htmlFor="member-2">Afaq</Label>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SortBySelect;
