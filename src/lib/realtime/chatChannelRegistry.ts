import { getSupabaseClient } from "./supabaseClient";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Bug this exists to fix: Supabase's own `client.channel(topic)` dedupes by
// topic string — two independent callers subscribing to the same topic get
// back the *same* RealtimeChannel object (see RealtimeClient.channel() in
// @supabase/realtime-js). That's normally convenient, except every caller
// here also independently calls `removeChannel()` on unmount — which does
// `channel.unsubscribe(); channel.teardown()` on that shared object,
// killing it for every other consumer still using it, not just the one
// that unmounted.
//
// Concretely: useChatRealtime (chat page, mounted only while a channel is
// open) and useChatUnreadSync (sidebar, mounted app-wide) both subscribe to
// `workspace-chat:{workspaceId}:{projectId|general}`. The moment you leave
// the chat page (or switch channels), useChatRealtime's cleanup tears down
// the shared channel object — silently killing useChatUnreadSync's
// subscription too, even though it never unmounted and has no way to know
// its channel just died. Its effect won't re-run (none of its dependencies
// changed), so that channel's unread tracking is dead for the rest of the
// session. This is why the unread badge stopped working after visiting the
// chat page even once.
//
// Fix: reference-count subscribers per topic+event here, and only actually
// call removeChannel() once the last subscriber has unsubscribed.
type ChatBroadcastEvent = "chat_message" | "chat_message_deleted";
type Handler = (payload: any) => void;
type StatusHandler = (status: string) => void;

interface RegistryEntry {
  channel: RealtimeChannel;
  refCount: number;
  handlers: Map<ChatBroadcastEvent, Set<Handler>>;
  statusHandlers: Set<StatusHandler>;
}

const registry = new Map<string, RegistryEntry>();

export const subscribeToChatTopic = (
  topic: string,
  event: ChatBroadcastEvent,
  handler: Handler,
  onStatus?: StatusHandler,
): (() => void) => {
  let entry = registry.get(topic);

  if (!entry) {
    const channel = getSupabaseClient().channel(topic, { config: { private: true } });
    entry = { channel, refCount: 0, handlers: new Map(), statusHandlers: new Set() };
    registry.set(topic, entry);
    // .subscribe(callback) can only meaningfully be called once per channel
    // object — this fans a single underlying subscribe-status stream out to
    // every subscribeToChatTopic() caller for this topic.
    channel.subscribe((status) => {
      entry!.statusHandlers.forEach((h) => h(status));
    });
  }

  const current = entry;

  if (!current.handlers.has(event)) {
    current.handlers.set(event, new Set());
    current.channel.on("broadcast", { event }, ({ payload }: { payload: unknown }) => {
      current.handlers.get(event)?.forEach((h) => h(payload));
    });
  }
  current.handlers.get(event)!.add(handler);
  if (onStatus) current.statusHandlers.add(onStatus);
  current.refCount += 1;

  return () => {
    current.handlers.get(event)?.delete(handler);
    if (onStatus) current.statusHandlers.delete(onStatus);
    current.refCount -= 1;

    if (current.refCount <= 0) {
      registry.delete(topic);
      getSupabaseClient().removeChannel(current.channel);
    }
  };
};
