"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ListChecks, PenTool } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/shadcn/avatar";
import { cn } from "@/src/lib/utils";
import { useWorkspaceStore } from "@/src/store/workspace";
import { useTaskStore } from "@/src/app/[workspace_name]/(workspace)/[project_id]/tasks/store/useTaskStore";
import type { ChatAttachment, ChatMessage } from "@/src/types/chat";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const initials = (name: string) => name.trim().slice(0, 2).toUpperCase();

const ATTACHMENT_ICON: Record<ChatAttachment["type"], typeof ListChecks> = {
  task: ListChecks,
  document: FileText,
  whiteboard: PenTool,
};

const ATTACHMENT_LABEL: Record<ChatAttachment["type"], string> = {
  task: "Task",
  document: "Document",
  whiteboard: "Whiteboard",
};

const ChatMessageItem = ({
  message,
  isOwn,
}: {
  message: ChatMessage;
  isOwn: boolean;
}) => {
  return (
    <div className={cn("flex gap-3 py-2", isOwn && "flex-row-reverse")}>
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
          <AttachmentCard attachment={message.attachment} pending={!!message.pending} />
        )}
      </div>
    </div>
  );
};

const AttachmentCard = ({
  attachment,
  pending,
}: {
  attachment: ChatAttachment;
  pending: boolean;
}) => {
  const router = useRouter();
  const workspaceSlug = useWorkspaceStore((s) => s.workspace?.workspaceSlug);
  const Icon = ATTACHMENT_ICON[attachment.type];

  const cardClassName = cn(
    "flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm hover:bg-muted",
    pending && "opacity-60",
  );

  const inner = (
    <>
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs text-muted-foreground">{ATTACHMENT_LABEL[attachment.type]}</span>
        <span className="truncate font-medium">{attachment.title}</span>
      </div>
    </>
  );

  if (attachment.type === "task") {
    // No direct route for a single task — open it via the task drawer on
    // that project's tasks page (see useTaskStore: isOpen/taskId are
    // transient, non-persisted state read by task-details-drawer.tsx).
    return (
      <button
        type="button"
        className={cardClassName}
        disabled={!workspaceSlug}
        onClick={() => {
          if (!workspaceSlug) return;
          useTaskStore.getState().setIsOpen(true, attachment.id);
          router.push(`/${workspaceSlug}/${attachment.projectId}/tasks`);
        }}
      >
        {inner}
      </button>
    );
  }

  const href =
    attachment.type === "document"
      ? `/${workspaceSlug}/${attachment.projectId}/docs/${attachment.id}`
      : `/${workspaceSlug}/${attachment.projectId}/whiteboards/${attachment.id}`;

  return (
    <Link href={href} className={cardClassName}>
      {inner}
    </Link>
  );
};

export default ChatMessageItem;
