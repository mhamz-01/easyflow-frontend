"use client";

import { useState } from "react";
import { Loader2, MessageSquare, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Avatar from "@/src/components/custom/avatar";
import { ChatMessage } from "@/src/types/chat";
import RecentActivityList from "../../_recent-activities/activities-list";
import { GetAllRecentActivitiesResponse } from "@/src/lib/api/recent-activities/services";
import Panel from "./panel";

type Tab = "chat" | "activity";

const UpdatesPanel = ({
  basePath,
  chatHref,
  messages,
  isChatLoading,
  isChatUnread,
  activities,
  isActivitiesLoading,
}: {
  basePath: string;
  chatHref: string;
  messages: ChatMessage[];
  isChatLoading: boolean;
  isChatUnread: boolean;
  activities: GetAllRecentActivitiesResponse["data"];
  isActivitiesLoading: boolean;
}) => {
  const [tab, setTab] = useState<Tab>("chat");
  const recentMessages = messages.slice(-4);

  return (
    <Panel
      icon={
        tab === "chat" ? (
          <MessageSquare className="size-4" />
        ) : (
          <History className="size-4" />
        )
      }
      title="Updates"
      meta={
        <div className="flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => setTab("chat")}
            className={`relative rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              tab === "chat" ? "bg-white/10 text-foreground" : "text-gray-400 hover:text-foreground"
            }`}
          >
            Chat
            {isChatUnread && tab !== "chat" && (
              <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-destructive" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab("activity")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              tab === "activity" ? "bg-white/10 text-foreground" : "text-gray-400 hover:text-foreground"
            }`}
          >
            Activity
          </button>
        </div>
      }
      href={tab === "chat" ? chatHref : `${basePath}/tasks`}
      hrefLabel={tab === "chat" ? "Open chat" : "Open project"}
    >
      {tab === "chat" ? (
        isChatLoading ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-10 text-center">
            <p className="text-sm font-medium text-gray-400">No messages yet</p>
            <p className="text-xs text-gray-600">Say hello to this project&apos;s channel.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3 px-4 py-3">
            {recentMessages.map((message) => (
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
        )
      ) : isActivitiesLoading ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-10 text-center">
          <History className="size-6 text-gray-600" />
          <p className="text-sm font-medium text-gray-400">No activity yet</p>
          <p className="text-xs text-gray-600">Task, doc, and whiteboard updates show up here.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06] px-4">
          {activities.map((item) => (
            <RecentActivityList
              key={item.id}
              name={item.title}
              type={item.type}
              updatedAt={item.updatedAt}
              editor={item.editor}
              projectName={null}
            />
          ))}
        </div>
      )}
    </Panel>
  );
};

export default UpdatesPanel;
