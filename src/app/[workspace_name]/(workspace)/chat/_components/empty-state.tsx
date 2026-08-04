import { MessageSquare } from "lucide-react";

const ChatEmptyState = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center p-6">
    <MessageSquare className="size-8 text-muted-foreground" />
    <h1 className="text-h1 font-medium">No messages yet</h1>
    <p className="text-sm text-muted-foreground">
      Say something to get the conversation started.
    </p>
  </div>
);

export default ChatEmptyState;
