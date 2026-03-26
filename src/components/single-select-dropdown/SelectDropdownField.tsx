import { ElementType } from "react";
import { SelectDropdown, SelectOption } from "./SelectDropdown";

type SelectDropdownFieldProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  Icon?: ElementType;
  iconClassName?: string;
  disabled?: boolean;
  className?: string;
};

export function SelectDropdownField(props: SelectDropdownFieldProps) {
  return <SelectDropdown {...props} />;
}
