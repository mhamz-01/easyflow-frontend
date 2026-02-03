import { FormProvider, useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "../../shadcn/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FieldGroup } from "@/src/components/shadcn/field";
import TaskNameInput from "./task-name-input";
import TaskDescriptionInput from "./task-description-textarea";
import TaskLinksInput from "./task-links-input";
import TaskDocumentCheckbox from "./task-documents";
import TaskChecklist from "./task-checklist";
import TaskDropdowns from "./task-select";
import TaskDialogFooter from "./task-dialog-footer";
import TaskAttachedFilesList from "./task-attached-files-list";

const formSchema = z.object({
  name: z.string().min(2, "Task name should be more than 2 letters"),
  description: z.string().optional(),
  linkName: z.string().or(z.literal("")).optional(),
  links: z.array(z.string()),
  documents: z.array(z.number()).optional(),
  checklist: z.array(
    z
      .object({
        name: z.string(),
        items: z.array(z.string()),
      })
      .optional(),
  ),
  status: z.string(),
  priority: z.string(),
  assignees: z.array(z.number()).optional(),
  date: z.date().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
});

const CreateTaskModal = () => {
  const createTaskForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      links: [],
      documents: [],
      checklist: [
        {
          name: "checklist",
          items: [],
        },
      ],
      status: "",
      priority: "",
      assignees: [],
      attachments: [],
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
    // createTaskForm.reset();
  }
  return (
    <DialogContent className="sm:max-w-200">
      <DialogHeader>
        <DialogTitle className="text-center">Create Task</DialogTitle>
      </DialogHeader>
      <FormProvider {...createTaskForm}>
        <form onSubmit={createTaskForm.handleSubmit(onSubmit)}>
          <FieldGroup>
            <TaskNameInput />
            <TaskDescriptionInput />
            <TaskLinksInput />
            <TaskDocumentCheckbox />
            <TaskChecklist />
            <TaskDropdowns />
            <TaskAttachedFilesList />
            <TaskDialogFooter />
          </FieldGroup>
        </form>
      </FormProvider>
    </DialogContent>
  );
};

export default CreateTaskModal;
