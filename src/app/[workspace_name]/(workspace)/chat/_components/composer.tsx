"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/src/components/shadcn/button";
import { Textarea } from "@/src/components/shadcn/textarea";
import { useSendMessage } from "@/src/hooks/chat";

const MAX_LENGTH = 2000;

const ChatComposer = () => {
  const [value, setValue] = useState("");
  const sendMessage = useSendMessage();

  const handleSend = () => {
    const content = value.trim();
    if (!content || sendMessage.isPending) return;

    sendMessage.mutate(content);
    setValue("");
  };

  return (
    <div className="flex items-end gap-2 border-t p-3">
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
        disabled={!value.trim() || sendMessage.isPending}
        isLoading={sendMessage.isPending}
        aria-label="Send message"
      >
        <SendHorizontal />
      </Button>
    </div>
  );
};

export default ChatComposer;
