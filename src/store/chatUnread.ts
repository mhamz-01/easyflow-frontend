import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tracks "this channel has activity you haven't seen" per workspace member,
// entirely client-side: no read-receipt table on the backend, just realtime
// broadcasts observed while the tab is open (see useChatUnreadSync) plus
// whatever this browser already had persisted from a previous session.
// Key scheme mirrors the realtime topic scheme: `${workspaceId}:${projectId ?? "general"}`.
type ChannelKey = string;

const channelKey = (workspaceId: number, projectId: number | null): ChannelKey =>
  `${workspaceId}:${projectId ?? "general"}`;

interface ChatUnreadState {
  unread: Record<ChannelKey, boolean>;
  // The channel currently on-screen (chat page mounted + that channel
  // selected) — messages arriving for this one are never flagged unread,
  // since the user is already looking at them.
  activeChannel: ChannelKey | null;
  setActiveChannel: (workspaceId: number, projectId: number | null) => void;
  clearActiveChannel: () => void;
  markUnread: (workspaceId: number, projectId: number | null) => void;
  markRead: (workspaceId: number, projectId: number | null) => void;
}

export const useChatUnreadStore = create<ChatUnreadState>()(
  persist(
    (set, get) => ({
      unread: {},
      activeChannel: null,

      setActiveChannel: (workspaceId, projectId) => {
        const key = channelKey(workspaceId, projectId);
        set({ activeChannel: key });
        if (get().unread[key]) {
          set((s) => {
            const next = { ...s.unread };
            delete next[key];
            return { unread: next };
          });
        }
      },

      clearActiveChannel: () => set({ activeChannel: null }),

      markUnread: (workspaceId, projectId) => {
        const key = channelKey(workspaceId, projectId);
        if (get().activeChannel === key) return;
        set((s) => (s.unread[key] ? s : { unread: { ...s.unread, [key]: true } }));
      },

      markRead: (workspaceId, projectId) => {
        const key = channelKey(workspaceId, projectId);
        set((s) => {
          if (!s.unread[key]) return s;
          const next = { ...s.unread };
          delete next[key];
          return { unread: next };
        });
      },
    }),
    {
      name: "chat-unread-store",
      partialize: (s) => ({ unread: s.unread }),
    },
  ),
);

export const isChannelUnread = (
  unread: Record<ChannelKey, boolean>,
  workspaceId: number,
  projectId: number | null,
) => !!unread[channelKey(workspaceId, projectId)];

export const hasWorkspaceUnread = (unread: Record<ChannelKey, boolean>, workspaceId: number) => {
  const prefix = `${workspaceId}:`;
  return Object.keys(unread).some((key) => unread[key] && key.startsWith(prefix));
};
