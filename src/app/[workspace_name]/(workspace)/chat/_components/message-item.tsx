import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/shadcn/avatar";
import { cn } from "@/src/lib/utils";
import type { ChatMessage } from "@/src/types/chat";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const initials = (name: string) => name.trim().slice(0, 2).toUpperCase();

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
            {formatTime(message.createdAt)}
          </span>
        </div>
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words",
            isOwn
              ? "bg-primary-blue text-white"
              : "bg-muted text-foreground",
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;
