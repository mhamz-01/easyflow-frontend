import { ElementType } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SelectDropdown, SelectOption } from "./SelectDropdown";

type SelectDropdownFormProps = {
  name: string;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  Icon?: ElementType;
  iconClassName?: string;
};

// Use inside react-hook-form <FormProvider> only
export function SelectDropdownForm({
  name,
  ...props
}: SelectDropdownFormProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SelectDropdown
          value={field.value}
          onChange={field.onChange}
          {...props}
        />
      )}
    />
  );
}
