import {
  Controller,
  createFormControl,
  FormProvider,
  useForm,
} from "react-hook-form";
import { Button } from "../../shadcn/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FieldGroup } from "@/src/components/shadcn/field";
import TaskNameInput from "./task-name-input";
import TaskDescriptionInput from "./task-description-textarea";
import TaskLinksInput from "./task-links-input";
import TaskDocumentCheckbox from "./task-documents-checkbox";

const formSchema = z.object({
  name: z.string().min(2, "Task name should be more than 2 letters"),
  description: z.string().optional(),
  linkName: z.string().or(z.literal("")).optional(),
  links: z.array(z.string()),
  documents: z.array(z.number()).optional(),
});

const CreateTaskModal = () => {
  const createTaskForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      links: [],
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
    createTaskForm.reset();
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Task</DialogTitle>
      </DialogHeader>
      <FormProvider {...createTaskForm}>
        <form onSubmit={createTaskForm.handleSubmit(onSubmit)}>
          <FieldGroup>
            <TaskNameInput />
            <TaskDescriptionInput />
            <TaskLinksInput />
            <TaskDocumentCheckbox />
            <DialogFooter>
              {/* attach files button */}
              <Button type="button">Attach files</Button>
              {/* create task button */}
              <Button type="submit">Create task</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </FormProvider>
    </DialogContent>
  );
};

export default CreateTaskModal;
