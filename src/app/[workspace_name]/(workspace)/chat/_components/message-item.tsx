"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/shadcn/avatar";
import { AlertDialog } from "@/src/components/shadcn/alert-dialog";
import AlertDialogContentModal from "@/src/components/modals/alert-dialog-content";
import { useDeleteMessage } from "@/src/hooks/chat";
import { AttachmentCard } from "./attachment-card";
import type { ChatMessage } from "@/src/types/chat";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const initials = (name: string) => name.trim().slice(0, 2).toUpperCase();

const ChatMessageItem = ({
  message,
  isOwn,
  workspaceId,
  projectId,
}: {
  message: ChatMessage;
  isOwn: boolean;
  workspaceId: number | null | undefined;
  projectId: number | null;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMessage = useDeleteMessage(workspaceId, projectId);
  const canDelete = isOwn && !message.pending && message.id > 0;

  return (
    <div className={cn("group flex gap-3 py-2", isOwn && "flex-row-reverse")}>
      <Avatar size="sm" className="mt-0.5 shrink-0">
        <AvatarImage src={message.author.imageUrl ?? undefined} />
        <AvatarFallback>{initials(message.author.username)}</AvatarFallback>
      </Avatar>

      <div className={cn("flex max-w-[70%] flex-col gap-1", isOwn && "items-end")}>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{message.author.username}</span>
          <span className="text-xs text-muted-foreground">
            {message.pending ? "Sending…" : formatTime(message.createdAt)}
          </span>
          {canDelete && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete message"
              className="opacity-0 transition-opacity text-muted-foreground hover:text-destructive group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>

        {message.content && (
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words",
              isOwn ? "bg-primary-blue text-white" : "bg-muted text-foreground",
              message.pending && "opacity-60",
            )}
          >
            {message.content}
          </div>
        )}

        {message.attachment && (
          <div className="w-full max-w-sm">
            <AttachmentCard attachment={message.attachment} pending={!!message.pending} />
          </div>
        )}
      </div>

      {canDelete && (
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContentModal
            title="Delete this message?"
            body="This can't be undone. The message will be removed for everyone in this channel."
            buttonText="Delete"
            loader={deleteMessage.isPending}
            onContinue={() => {
              deleteMessage.mutate(message.id, {
                onSuccess: () => setConfirmOpen(false),
              });
            }}
          />
        </AlertDialog>
      )}
    </div>
  );
};

export default ChatMessageItem;
