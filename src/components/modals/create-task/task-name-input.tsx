import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../../shadcn/field";
import { Input } from "../../shadcn/input";

const TaskNameInput = () => {
  const form = useFormContext();
  return (
    <Controller
      name="name"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="form-task-name">Task Name</FieldLabel>
          <Input
            {...field}
            id="form-task-name"
            aria-invalid={fieldState.invalid}
            placeholder="Enter task name here..."
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default TaskNameInput;
