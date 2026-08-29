"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Avatar from "@/src/components/custom/avatar";
import { ChatMessage } from "@/src/types/chat";
import Panel from "./panel";

const ChatPreview = ({
  chatHref,
  messages,
  isLoading,
  isUnread,
}: {
  chatHref: string;
  messages: ChatMessage[];
  isLoading: boolean;
  isUnread: boolean;
}) => {
  const recent = messages.slice(-4);

  return (
    <Panel
      icon={<MessageSquare className="size-4" />}
      title="Chat"
      meta={isUnread && <span className="size-1.5 shrink-0 rounded-full bg-destructive" />}
      href={chatHref}
      hrefLabel="Open chat"
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : recent.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-10 text-center">
          <p className="text-sm font-medium text-gray-400">No messages yet</p>
          <p className="text-xs text-gray-600">Say hello to this project&apos;s channel.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3 px-4 py-3">
          {recent.map((message) => (
            <li key={message.id} className="flex items-start gap-2.5">
              <Avatar
                src={message.author.imageUrl ?? undefined}
                width={22}
                height={22}
                className="mt-0.5 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="truncate text-xs font-medium">{message.author.username}</span>
                  <span className="shrink-0 text-[10px] text-gray-500">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="truncate text-sm text-gray-300">
                  {message.content ?? (message.attachment ? `Shared: ${message.attachment.title}` : "")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

export default ChatPreview;
