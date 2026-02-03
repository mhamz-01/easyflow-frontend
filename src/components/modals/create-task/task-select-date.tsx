import { Calendar as CalendarIcon } from "lucide-react";
import TaskPopover from "./task-popover";
import { useState } from "react";
import { Calendar } from "../../shadcn/calendar";
import { Controller, useFormContext } from "react-hook-form";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function TaskSelectDate() {
  const { control } = useFormContext();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date | undefined>(date);

  return (
    <Controller
      name="date"
      control={control}
      render={({ field }) => (
        <TaskPopover
          inputName={field.name}
          value={field.value}
          Icon={CalendarIcon}
          iconClassName="text-green-500"
        >
          <Calendar
            mode="single"
            selected={date}
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              field.onChange(date);
              setDate(date);
            }}
          />
        </TaskPopover>
      )}
    />
  );
}
