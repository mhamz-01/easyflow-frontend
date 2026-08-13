import { useFormContext } from "react-hook-form";
import { Field, FieldLabel } from "../../shadcn/field";
import { Globe, Lock } from "lucide-react";

// Same Public/Private toggle pattern as create-item-modal.tsx (docs/
// whiteboards) — a button pair, not a form-field-style dropdown, so
// visibility reads as a top-level choice rather than another input.
const TaskVisibilityToggle = () => {
  const { watch, setValue } = useFormContext();
  const isPrivate = watch("visibility") === "private";

  return (
    <Field>
      <FieldLabel>Visibility</FieldLabel>
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={() => setValue("visibility", "public")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            !isPrivate
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          <Globe size={15} />
          Public
        </button>
        <button
          type="button"
          onClick={() => setValue("visibility", "private")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            isPrivate
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          <Lock size={15} />
          Private
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {isPrivate
          ? "Only you can see this task."
          : "Everyone in the project can see this task."}
      </p>
    </Field>
  );
};

export default TaskVisibilityToggle;
