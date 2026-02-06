import { DialogFooter } from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Paperclip } from "lucide-react";
import { useFileDialog } from "@mantine/hooks";
import { useFormContext } from "react-hook-form";
import { uploadFile } from "@/src/lib/api/files/service";
import { useWorkspaceStore } from "@/src/store/workspace";
import { toast } from "sonner";

const uploadFiles = async (files: File[]) => {
  return await Promise.all(files.map((file) => uploadFile(file)));
};

const TaskDialogFooter = () => {
  const { setValue, getValues, watch } = useFormContext<{
    attachments: File[];
    attachedFilesId: number[];
  }>();
  const attachments = watch("attachments") || [];
  const workspaceId = useWorkspaceStore((s) => s.workspace?.id);

  // upload files to R2 storage
  const fileDialog = useFileDialog({
    async onChange(files) {
      if (!files) return;

      // create newFiles array from uploaded files
      const newFiles = files instanceof FileList ? Array.from(files) : [files];

      setValue("attachments", [...attachments, ...newFiles]);

      // check workspace
      if (!workspaceId) {
        toast.error("Workspace not selected. Please try again.");
        return;
      }

      // upload file or files
      try {
        // upload files to database and R2
        const uploadedFileIds = await uploadFiles(newFiles);

        setValue("attachedFilesId", [
          ...(getValues("attachedFilesId") ?? []),
          ...uploadedFileIds,
        ]);
      } catch (error) {
        let message = "Some file(s) couldn’t be uploaded.";
        toast.error(message);
        // 🧠 Roll back only the newly added files
        setValue(
          "attachments",
          attachments.filter(
            (file) =>
              !newFiles.some(
                (newFile) =>
                  newFile.name === file.name && newFile.size === file.size,
              ),
          ),
        );
      }
    },
  });

  return (
    <DialogFooter className="w-full sm:justify-between">
      {/* attach files button */}
      <Button onClick={fileDialog.open} variant="ghost" type="button">
        <Paperclip />
        Attach files
      </Button>
      {/* create task button */}
      <Button variant="primary" type="submit">
        Create task
      </Button>
    </DialogFooter>
  );
};

export default TaskDialogFooter;
