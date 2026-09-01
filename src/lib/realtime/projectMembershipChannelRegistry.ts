import { getSupabaseClient } from "./supabaseClient";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Same reference-counting fix as chatChannelRegistry.ts: multiple components
// (the members modal, the badge on an avatar, a "you were removed" listener)
// can all be mounted at once against the same project's membership topic —
// only the last one to unmount should actually tear the channel down.
type Handler = (payload: { userId: number; status: "active" | "removed" }) => void;

interface RegistryEntry {
  channel: RealtimeChannel;
  refCount: number;
  handlers: Set<Handler>;
}

const registry = new Map<string, RegistryEntry>();

export const subscribeToProjectMembership = (
  workspaceId: number,
  projectId: number,
  handler: Handler,
): (() => void) => {
  const topic = `project-membership:${workspaceId}:${projectId}`;
  let entry = registry.get(topic);

  if (!entry) {
    const channel = getSupabaseClient().channel(topic, { config: { private: true } });
    entry = { channel, refCount: 0, handlers: new Set() };
    registry.set(topic, entry);
    channel
      .on("broadcast", { event: "member_changed" }, ({ payload }) => {
        entry!.handlers.forEach((h) => h(payload as { userId: number; status: "active" | "removed" }));
      })
      .subscribe();
  }

  const current = entry;
  current.handlers.add(handler);
  current.refCount += 1;

  return () => {
    current.handlers.delete(handler);
    current.refCount -= 1;

    if (current.refCount <= 0) {
      registry.delete(topic);
      getSupabaseClient().removeChannel(current.channel);
    }
  };
};
