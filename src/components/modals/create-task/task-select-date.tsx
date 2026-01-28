import { Calendar as CalendarIcon } from "lucide-react";
import TaskPopover from "./task-popover";
import { useState } from "react";
import { Calendar } from "../../shadcn/calendar";
import { Field } from "@/src/components/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/src/components/shadcn/input-group";
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
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export default function TaskSelectDate() {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  console.log("date", value);

  return (
    <Controller
      name="date"
      control={control}
      render={({ field, fieldState }) => (
        <TaskPopover
          inputName="date"
          Icon={CalendarIcon}
          iconClassName="text-green-500"
        >
          <Calendar
            mode="single"
            selected={date}
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              setDate(date);
              setValue(formatDate(date));
              setOpen(false);
            }}
          />
        </TaskPopover>
      )}
    />
  );
}
