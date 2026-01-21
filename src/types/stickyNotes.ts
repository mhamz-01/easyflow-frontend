import { JSONContent } from "@tiptap/react";

export interface StickyNote {
  id: number;
  content: JSONContent;
  workspaceId: number;
  userId: string;
  bgColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface StickyNotesResponse {
  data: StickyNote[];
  nextCursor: number | null;
}

export interface CreateStickyNoteResponse {
  success: true;
  stickyNote: StickyNote;
}
