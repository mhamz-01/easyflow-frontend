import { ElementType } from "react";
import { Controller, useFormContext } from "react-hook-form";
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
type propsType = {
  name: string;
  options: {
    label: string;
    value: string;
  }[];
  Icon?: ElementType;
  iconClassName?: string;
};
export default function TaskSelectDropdown({
  name,
  options,
  Icon,
  iconClassName,
}: propsType) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="w-max max-w-48">
            {!field.value && Icon && (
              <Icon className={cn("h-4 w-4", iconClassName)} />
            )}
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="capitalize">Select {name}</SelectLabel>
              {options.map((option) => (
                <SelectItem value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
}
