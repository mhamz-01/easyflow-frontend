// lib/api/stickyNotes/services.ts
import { StickyNote } from "@/src/types/stickyNotes";
import { api } from "../client";
import { JSONContent } from "@tiptap/react";

// Get all sticky notes
export const getAllStickyNotes = async ({
  userId,
  workspaceId,
  cursor,
  limit = 6,
}: {
  userId: string;
  workspaceId: number;
  cursor?: number;
  limit?: number;
}) => {
  const response = await api.get("/stickyNotes", {
    params: {
      userId,
      workspaceId,
      cursor,
      limit,
    },
  });

  return response.data as {
    data: StickyNote[];
    nextCursor: number | null;
  };
};

// Create a sticky note
export const createStickyNote = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: number;
}) => {
  const response = await api.post("/stickyNotes/create", {
    userId,
    workspaceId,
  });
  return response.data;
};

// Update a sticky note using its id
export const updateStickyNote = async ({
  id,
  isEmpty,
  content,
}: {
  id: number;
  isEmpty: boolean;
  content: JSONContent;
}) => {
  const response = await api.patch(
    "/stickyNotes/update",
    { content, isEmpty },
    {
      params: { id },
    }
  );
  return response.data;
};

// Delete a sticky note
export const deleteStickyNote = async ({
  id,
  userId,
  workspaceId,
}: {
  id: number;
  userId: string;
  workspaceId: number;
}) => {
  const response = await api.delete("/stickyNotes/delete", {
    params: { id, userId, workspaceId },
  });
  return response.data;
};
