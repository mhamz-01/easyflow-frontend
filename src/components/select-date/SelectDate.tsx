import { useState } from "react";
import { Calendar } from "../shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";

type DateValue = Date | undefined;

type SelectDateProps = {
  value?: DateValue;
  onChange?: (value: DateValue) => void;
  renderTrigger: (props: {
    value: DateValue;
    open: boolean;
  }) => React.ReactNode;
};

export default function SelectDate({
  value,
  onChange,
  renderTrigger,
}: SelectDateProps) {
  const [selected, setSelected] = useState<DateValue>(value);
  const [month, setMonth] = useState<Date | undefined>(
    value instanceof Date ? value : new Date(),
  );
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {renderTrigger({ value: selected, open })}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected as Date | undefined}
          month={month}
          onMonthChange={setMonth}
          onSelect={(val) => {
            setSelected(val);
            setOpen(false);
            onChange?.(val);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
