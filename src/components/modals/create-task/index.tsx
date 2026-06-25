import { FormProvider, useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "../../shadcn/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
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

const CreateTaskModal = ({ onClose }: { onClose: () => void }) => {
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

  function onSubmit(data: CreateTaskFormDataType) {
    if (!workspaceId || !projectId) return;

    const { attachments, linkName, documents, whiteboards, ...apiData } = data;

    // drop the default empty checklist placeholder if the user never filled one in
    const cleanedChecklist = (apiData.checklist ?? []).filter(
      (group) =>
        group.name.trim() !== "" ||
        group.items.some((item) => item.trim() !== "")
    );

    createTask.mutate({
      ...apiData,
      checklist: cleanedChecklist,
      workspaceId: workspaceId,
      projectId: projectId,
      attachedDocs: documents ?? [],
      attachedWhiteboards: whiteboards ?? [],
    });

    // close right away and clear the form -- creation continues in the
    // background, the "Create Task" trigger stays disabled until it resolves
    onClose();
    form.reset();
  }
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
