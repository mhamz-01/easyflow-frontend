import { DialogFooter } from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Paperclip } from "lucide-react";
import { useFileDialog } from "@mantine/hooks";
import { useFormContext } from "react-hook-form";

const TaskDialogFooter = () => {
  const { setValue, watch } = useFormContext<{ attachments: File[] }>();
  const attachments = watch("attachments") || [];

  const fileDialog = useFileDialog({
    onChange(files) {
      if (!files) return; // handle null case

      // Convert FileList to Array<File> if needed
      const newFiles = files instanceof FileList ? Array.from(files) : [files];

      // Append new files to existing attachments
      setValue("attachments", [...attachments, ...newFiles]);
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
