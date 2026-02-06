"use client";

import { useFormContext, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { useFileDialog } from "@mantine/hooks";
import { useCallback } from "react";
import { Label } from "../../shadcn/label";
import { Button } from "../../shadcn/button";
import { toast } from "sonner";
import { deleteFile } from "@/src/lib/api/files/service";

function TaskAttachedFilesList() {
  const { control, getValues, setValue, watch } = useFormContext<{
    attachments: File[];
    attachedFilesId: number[];
  }>();
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

  // Handle removing a file
  const handleRemoveFile = useCallback(
    async (index: number) => {
      const fileId = getValues("attachedFilesId")?.[index];

      try {
        // 🗑️ delete from backend (R2 + DB)
        if (fileId) {
          await deleteFile(fileId);
        }

        // ✅ update UI state
        const updatedAttachments = [...attachments];
        updatedAttachments.splice(index, 1);
        setValue("attachments", updatedAttachments);

        const updatedFileIds = [...(getValues("attachedFilesId") ?? [])];
        updatedFileIds.splice(index, 1);
        setValue("attachedFilesId", updatedFileIds);
      } catch (error) {
        console.error(error);
        toast.error("Failed to remove file. Please try again.");
      }
    },
    [attachments, setValue, getValues],
  );

  return (
    attachments?.length > 0 && (
      <div>
        <Label className="mb-2">Attachments</Label>
        <Controller
          name="attachments"
          control={control}
          render={() => (
            <div>
              {attachments?.length > 0 && (
                <div className="max-h-60 border rounded p-2 mb-2">
                  <ul className="space-y-1">
                    {attachments?.map((file, index) => (
                      <li
                        key={file.name + index}
                        className="flex justify-between text-sm items-center border p-1 rounded"
                      >
                        <span>{file.name}</span>
                        <X
                          className="cursor-pointer text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveFile(index)}
                          size={16}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Drag and drop files to attach or{" "}
                <Button
                  type="button"
                  onClick={fileDialog.open}
                  variant={"ghost"}
                  className="p-0 underline"
                >
                  browse
                </Button>
              </p>
            </div>
          )}
        />
      </div>
    )
  );
}

export default TaskAttachedFilesList;
