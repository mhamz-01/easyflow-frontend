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
import TaskVisibilityToggle from "./task-visibility-toggle";

const CreateTaskModal = ({
  onClose,
  defaultState,
  defaultPriority,
}: {
  onClose: () => void;
  /** Pre-fills the state field — e.g. when created from a board column's "Add task" button. */
  defaultState?: string;
  /** Pre-fills the priority field — e.g. when created from a priority-grouped board column. */
  defaultPriority?: string;
}) => {
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
      state: defaultState ?? "todo",
      priority: defaultPriority ?? "medium",
      assignees: [],
      attachments: [],
      attachedFilesId: [],
      visibility: "public",
    },
  });

  function onSubmit(data: CreateTaskFormDataType) {
    if (!workspaceId || !projectId) return;

    const { attachments, linkName, documents, whiteboards, visibility, ...apiData } = data;

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
      isPrivate: visibility === "private",
    });

    // close right away and clear the form -- creation continues in the
    // background, the "Create Task" trigger stays disabled until it resolves
    onClose();
    form.reset();
  }
  return (
    <DialogContent className="sm:max-w-200 flex max-h-[85vh] min-h-0 flex-col overflow-hidden">
      <DialogHeader className="shrink-0">
        <DialogTitle className="text-center">Create Task</DialogTitle>
      </DialogHeader>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* Scrollable field area — header/footer stay pinned so the
              dialog never grows taller than the viewport. `min-h-0` is
              required here: flex items default to `min-height: auto`,
              which lets them grow past their flex-basis to fit content
              instead of shrinking to the available space — without it,
              this div (and the DialogOverlay behind it) grows with the
              content instead of scrolling internally, which is what let
              the page-level scrollbar take over whenever a dropdown
              opened. */}
          <div className="themed-scrollbar scroll-fade-y min-h-0 flex-1 overflow-y-auto pr-1">
            <FieldGroup>
              <TaskNameInput />
              <TaskVisibilityToggle />
              <TaskDescriptionInput />
              <TaskLinksInput />
              <TaskDocumentCheckbox />
              <TaskSelectWhiteboard/>
              <TaskChecklist />
              <TaskDropdowns />
              <TaskAttachedFilesList />
            </FieldGroup>
          </div>
          <div className="shrink-0 mt-4 border-t border-border pt-4">
            <TaskDialogFooter />
          </div>
        </form>
      </FormProvider>
    </DialogContent>
  );
};

export default CreateTaskModal;
