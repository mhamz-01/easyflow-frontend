"use client";

import { useState } from "react";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import { Button } from "@/src/components/shadcn/button";
import { Textarea } from "@/src/components/shadcn/textarea";
import { useSendMessage } from "@/src/hooks/chat";
import { useWorkspaceStore } from "@/src/store/workspace";
import AttachmentPicker from "./attachment-picker";
import type { ChatAttachment } from "@/src/types/chat";

const MAX_LENGTH = 2000;

const ATTACHMENT_LABEL: Record<ChatAttachment["type"], string> = {
  task: "Task",
  document: "Document",
  whiteboard: "Whiteboard",
};

const ChatComposer = ({
  workspaceId,
  projectId,
}: {
  workspaceId: number | null | undefined;
  projectId: number | null;
}) => {
  const workspaceSlug = useWorkspaceStore((s) => s.workspace?.workspaceSlug);
  const [value, setValue] = useState("");
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const sendMessage = useSendMessage(workspaceId, projectId);

  const handleSend = () => {
    const content = value.trim();
    if ((!content && !attachment) || sendMessage.isPending) return;

    sendMessage.mutate({
      content: content || undefined,
      attachment: attachment ?? undefined,
    });
    setValue("");
    setAttachment(null);
  };

  return (
    <div className="flex flex-col gap-2 border-t p-3">
      {attachment && (
        <div className="flex w-fit items-center gap-2 rounded-md border bg-muted px-2 py-1 text-sm">
          <span className="text-muted-foreground">{ATTACHMENT_LABEL[attachment.type]}:</span>
          <span className="font-medium">{attachment.title}</span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            aria-label="Remove attachment"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setPickerOpen(true)}
          disabled={!workspaceId}
          aria-label="Attach a task, document, or whiteboard"
        >
          <Paperclip />
        </Button>

        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message the workspace…"
          className="min-h-10 max-h-40 resize-none"
        />
        <Button
          size="icon"
          variant="primary"
          onClick={handleSend}
          disabled={(!value.trim() && !attachment) || sendMessage.isPending}
          isLoading={sendMessage.isPending}
          aria-label="Send message"
        >
          <SendHorizontal />
        </Button>
      </div>

      {workspaceId && (
        <AttachmentPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          workspaceId={workspaceId}
          workspaceSlug={workspaceSlug}
          projectId={projectId}
          onPick={setAttachment}
        />
      )}
    </div>
  );
};

export default ChatComposer;
