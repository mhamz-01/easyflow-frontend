import { getSupabaseClient } from "./supabaseClient";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Same ref-counted-subscriber pattern as chatChannelRegistry.ts, and for the
// same reason: Supabase's `client.channel(topic)` dedupes by topic string,
// so two independent subscribers to the same per-user notification topic
// would otherwise share one RealtimeChannel object and tear it down for
// each other on unmount. Kept as its own small registry rather than
// generalizing chatChannelRegistry — that module is chat-specific
// (ChatBroadcastEvent) and battle-tested; duplicating ~60 lines here is
// cheaper than risking a regression in a working, subtly-fixed module for a
// second, unrelated domain.
type NotificationBroadcastEvent = "notification_created";
type Handler = (payload: unknown) => void;
type StatusHandler = (status: string) => void;

interface RegistryEntry {
  channel: RealtimeChannel;
  refCount: number;
  handlers: Map<NotificationBroadcastEvent, Set<Handler>>;
  statusHandlers: Set<StatusHandler>;
}

const registry = new Map<string, RegistryEntry>();

export const subscribeToNotificationTopic = (
  topic: string,
  event: NotificationBroadcastEvent,
  handler: Handler,
  onStatus?: StatusHandler,
): (() => void) => {
  let entry = registry.get(topic);

  if (!entry) {
    const channel = getSupabaseClient().channel(topic, { config: { private: true } });
    entry = { channel, refCount: 0, handlers: new Map(), statusHandlers: new Set() };
    registry.set(topic, entry);
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
