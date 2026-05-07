import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Field, FieldGroup, FieldLabel } from "../shadcn/field";
import Avatar from "../custom/avatar";
import { Checkbox } from "../shadcn/checkbox";

type DropdownSelectProps<T> = {
  items: T[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  /** Currently selected IDs, managed by parent */
  selectedValues: number[];

  /** Called when an item is toggled — parent decides what to do */
  onSelect: (id: number, item: T) => void;

  /** How to read values from item */
  getId: (item: T) => number;
  getLabel: (item: T) => string;
  getImageSrc?: (item: T) => string;

  /** Optional icon */
  iconSrc?: string;

  /** Optional label override for the header count */
  selectionLabel?: string;
};

function DropdownSelect<T>({
  items,
  isOpen,
  setIsOpen,
  selectedValues,
  onSelect,
  getId,
  getLabel,
  getImageSrc,
  iconSrc,
  selectionLabel = "item(s) selected",
}: DropdownSelectProps<T>) {
  const isChecked = (id: number) => selectedValues.includes(id);

  if (!isOpen) return null;

  return (
    <div className="absolute z-auto top-10 pt-1 w-full rounded-md border dark:bg-background shadow">
      {/* Header */}
      <div className="flex justify-between px-3 py-2 border-b">
        <p className="text-sm font-medium">
          {selectedValues.length} {selectionLabel}
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
                  <FieldLabel htmlFor={`dropdown-select-${id}`}>
                    {getImageSrc ? (
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
                    id={`dropdown-select-${id}`}
                    checked={isChecked(id)}
                    onCheckedChange={() => onSelect(id, item)}
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

export default DropdownSelect;
