"use client";

import { Button } from "@/src/components/shadcn/button";
import { Input } from "@/src/components/shadcn/input";
import { MinusIcon, PlusIcon, X } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../shadcn/collapsible";
import { Field, FieldError } from "../../shadcn/field";
import { normalizeUrl } from "@/src/lib/utils";
import Link from "next/link";
import TaskCollapsibleButton from "./task-collapsible-button";

export default function TaskLinksInput() {
  const { control, setValue, getValues, trigger } = useFormContext();

  const links = useWatch({ name: "links" }) as string[] | undefined;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const addLink = async () => {
    const isValid = await trigger("linkName");
    if (!isValid) return;

    const rawValue = getValues("linkName");
    const normalized = normalizeUrl(rawValue);

    // prevent duplicates
    if (links?.includes(normalized)) return;

    append(normalized);
    setValue("linkName", "");
  };

  return (
    <TaskCollapsibleButton title="Add links">
      {/* Input */}
      <Controller
        name="linkName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex gap-2">
              <Input
                {...field}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLink();
                  }
                }}
                placeholder="https://example.com"
                aria-invalid={fieldState.invalid}
              />
              <Button type="button" onClick={addLink}>
                Add
              </Button>
            </div>

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* List */}
      {fields.length > 0 && (
        <ul className="space-y-2">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
            >
              <Link
                className="truncate"
                href={links?.[index] ?? ""}
                target="_blank"
              >
                {links?.[index]}
              </Link>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </TaskCollapsibleButton>
  );
}
