import { Calendar as CalendarIcon } from "lucide-react";
import TaskPopover from "./task-popover";
import { useState } from "react";
import { Calendar } from "../../shadcn/calendar";
import { Controller, useFormContext } from "react-hook-form";

export default function TaskSelectDate() {
  const { control } = useFormContext();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date | undefined>(date);

  return (
    <Controller
      name="dueDate"
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
              console.log("Date", typeof date);
              field.onChange(date);
              setDate(date);
            }}
          />
        </TaskPopover>
      )}
    />
  );
}
