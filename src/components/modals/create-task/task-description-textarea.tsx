import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError } from "../../shadcn/field";
import { Textarea } from "../../shadcn/textarea";

import TaskCollapsibleButton from "./task-collapsible-button";

const TaskDescriptionInput = () => {
  const form = useFormContext();
  return (
    <TaskCollapsibleButton title="Add description">
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Textarea
              {...field}
              id="form-rhf-textarea-about"
              aria-invalid={fieldState.invalid}
              placeholder="I'm a software engineer..."
              className="min-h-30"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </TaskCollapsibleButton>
  );
};

export default TaskDescriptionInput;
