// lib/api/stickyNotes/keys.ts
export const stickyNotesKeys = {
  all: (userId: string, workspaceId: number) => [
    "stickyNotes",
    userId,
    workspaceId,
  ],
};
