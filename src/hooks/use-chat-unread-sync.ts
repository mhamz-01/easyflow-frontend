"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { getProjectsByWorkspaceSlug } from "@/src/lib/api/project/services";
import { getSupabaseClient } from "@/src/lib/realtime/supabaseClient";
import { useChatUnreadStore } from "@/src/store/chatUnread";
import type { ChatMessage } from "@/src/types/chat";
import type { sidebarProjectType } from "@/src/types/project";

// App-wide (not just on the chat page) so a badge can show up in the main
// sidebar no matter where you're currently browsing. One realtime
// subscription per channel — General plus every project the sidebar's own
// project list already resolves for this user, so a private project you
// can't see never gets subscribed to (the RLS policy would reject it
// anyway, but this also skips the wasted connection attempt).
//
// This is intentionally NOT a read-receipt system: there's no backend
// table remembering what you've read across devices/sessions. A channel is
// "unread" only because a broadcast for it arrived while this tab had this
// hook mounted. Good enough for "someone posted while you were looking
// elsewhere in the app"; a message sent while you were fully offline won't
// retroactively flag anything until the next message arrives after you're
// back.
export const useChatUnreadSync = (
  workspaceId: number | null | undefined,
  workspaceSlug: string | undefined,
) => {
  const { user } = useUser();
  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
  const markUnread = useChatUnreadStore((s) => s.markUnread);

  const { data } = useQuery({
    queryKey: ["projects", workspaceSlug],
    queryFn: () => getProjectsByWorkspaceSlug(workspaceSlug!),
    enabled: Boolean(workspaceSlug),
  });
  const projectIds = ((data?.projects ?? []) as sidebarProjectType[]).map((p) => p.id);
  const projectIdsKey = projectIds.join(",");

  useEffect(() => {
    if (!workspaceId) return;

    const supabase = getSupabaseClient();
    const channelIds: (number | null)[] = [
      null,
      ...projectIdsKey.split(",").filter(Boolean).map(Number),
    ];

    const channels = channelIds.map((projectId) => {
      const topic = `workspace-chat:${workspaceId}:${projectId ?? "general"}`;
      const channel = supabase.channel(topic, { config: { private: true } });

      channel
        .on("broadcast", { event: "chat_message" }, ({ payload }) => {
          const message = payload as ChatMessage;
          if (message.author.email === currentUserEmail) return;
          markUnread(workspaceId, projectId);
        })
        .subscribe();

      return channel;
    });

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [workspaceId, projectIdsKey, currentUserEmail, markUnread]);
};
