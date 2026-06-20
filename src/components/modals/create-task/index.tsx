import { FormProvider, useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "../../shadcn/dialog";
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
import { useCreateTask } from "@/src/hooks/tasks";
import {
  CreateTaskFormDataType,
  createTaskFormSchema,
} from "@/src/validations/tasks";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useProjectStore } from "@/src/store/useProjectStore";
import TaskSelectWhiteboard from "./task-select-whiteboard";

const CreateTaskModal = () => {
  const createTask = useCreateTask();
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);
  const projectId = useProjectStore((s) => s.project?.id);
  const form = useForm<CreateTaskFormDataType>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      links: [],
      checklist: [
        {
          name: "",
          items: [""],
        },
      ],
      documents: [],
      whiteboards: [],   
      state: "todo",
      priority: "medium",
      assignees: [],
      attachments: [],
      attachedFilesId: [],
    },
  });

  async function onSubmit(data: CreateTaskFormDataType) {
    try {
      if (workspaceId && projectId) {
        const { attachments, linkName, documents, whiteboards, ...apiData } = data;
  
        // drop the default empty checklist placeholder if the user never filled one in
        const cleanedChecklist = (apiData.checklist ?? []).filter(
          (group) =>
            group.name.trim() !== "" ||
            group.items.some((item) => item.trim() !== "")
        );
  
        showSubmissionToast(apiData);
        await createTask.mutateAsync({
          ...apiData,
          checklist: cleanedChecklist,
          workspaceId: workspaceId,
          projectId: projectId,
          attachedDocs: documents ?? [],
          attachedWhiteboards: whiteboards ?? [],
        });
      }
      form.reset();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }
  const showSubmissionToast = (data: CreateTaskFormDataType) => {
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
  };
  return (
    <DialogContent className="sm:max-w-200">
      <DialogHeader>
        <DialogTitle className="text-center">Create Task</DialogTitle>
      </DialogHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <TaskNameInput />
            <TaskDescriptionInput />
            <TaskLinksInput />
            <TaskDocumentCheckbox />
            <TaskSelectWhiteboard/>
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
