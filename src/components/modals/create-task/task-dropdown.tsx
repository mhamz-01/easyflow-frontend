import { Dispatch, SetStateAction } from "react";
import { Field, FieldGroup, FieldLabel } from "../../shadcn/field";
import { Checkbox } from "../../shadcn/checkbox";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import Image from "next/image";
import Avatar from "../../custom/avatar";

type TaskDropdownProps<T> = {
  items: T[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  /** React Hook Form field name */
  inputName: string;

  /** How to read values from item */
  getId: (item: T) => number;
  getLabel: (item: T) => string;
  getImageSrc?: (item: T) => string;

  /** Optional icon */
  iconSrc?: string;
};

function TaskDropdown<T>({
  items,
  isOpen,
  setIsOpen,
  inputName,
  getId,
  getLabel,
  getImageSrc,
  iconSrc,
}: TaskDropdownProps<T>) {
  const { setValue, getValues, watch } = useFormContext();

  const selectedValues: number[] = getValues(inputName) || [];

  const isChecked = (id: number) => selectedValues.includes(id);

  const toggleValue = (id: number) => {
    const updatedValues = selectedValues.includes(id)
      ? selectedValues.filter((v) => v !== id)
      : [...selectedValues, id];

    setValue(inputName, updatedValues);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute z-50 top-10 mt-1 w-full rounded-md border bg-background shadow">
      {/* Header */}
      <div className="flex justify-between px-3 py-2 border-b">
        <p className="text-sm font-medium">
          {watch(inputName)?.length || 0} item(s) selected
        </p>
        <X
          className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(false)}
        />
      </div>

      {items.length > 0 ? (
        <div className="max-h-48 overflow-auto">
          {items.map((item) => {
            const id = getId(item);

            return (
              <FieldGroup key={id} className="px-3 py-2 text-sm hover:bg-muted">
                <Field orientation="horizontal">
                  <FieldLabel htmlFor={`${inputName}-${id}`}>
                    {inputName === "assignees" && getImageSrc ? (
                      <Avatar
                        src={getImageSrc(item)}
                        className="w-8 h-8"
                        width={20}
                        height={20}
                      />
                    ) : (
                      iconSrc && (
                        <Image
                          src={iconSrc}
                          width={20}
                          height={20}
                          alt="icon"
                        />
                      )
                    )}
                    {getLabel(item)}
                  </FieldLabel>

                  <Checkbox
                    id={`${inputName}-${id}`}
                    checked={isChecked(id)}
                    onCheckedChange={() => toggleValue(id)}
                  />
                </Field>
              </FieldGroup>
            );
          })}
        </div>
      ) : (
        <p className="text-sm px-4 py-3 text-muted-foreground">
          No result found
        </p>
      )}
    </div>
  );
}

export default TaskDropdown;
