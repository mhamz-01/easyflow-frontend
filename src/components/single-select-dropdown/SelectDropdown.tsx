import { ElementType } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shadcn/select";
import { cn } from "@/src/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
  icon?: ElementType;
  iconClassName?: string;
};

type SelectDropdownProps = {
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  Icon?: ElementType;
  iconClassName?: string;
  disabled?: boolean;
  className?: string;
};

export function SelectDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  Icon,
  iconClassName,
  disabled,
  className,
}: SelectDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn("capitalize w-full", className)}
      >
        {!value && Icon && <Icon className={cn("h-4 w-4", iconClassName)} />}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel className="capitalize">{label}</SelectLabel>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
