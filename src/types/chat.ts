// chat/types.ts
export interface ChatAuthor {
  id: number;
  username: string;
  email: string;
  imageUrl?: string | null;
}

// Denormalized snapshot of a shared task/document/whiteboard, captured at
// send time — projectId is included (not just id/title) because a task has
// no direct URL: opening it means navigating to that project's tasks page
// and opening the task drawer there.
export interface ChatAttachment {
  type: "task" | "document" | "whiteboard";
  id: number;
  title: string;
  projectId: number;
}

export interface ChatMessage {
  id: number;
  workspaceId: number;
  // null = the workspace's General channel; set = that project's channel.
  projectId: number | null;
  userId: number;
  // Nullable: a message can be a bare attachment card with no text.
  content: string | null;
  attachment?: ChatAttachment | null;
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: ChatAuthor;
  // Client-only: set on the local echo shown before the server confirms the
  // send, cleared once reconciled with the real message. Never comes from the API.
  pending?: boolean;
}

export interface ChatMessagesPage {
  messages: ChatMessage[];
  pagination: {
    nextCursor: number | null;
    hasMore: boolean;
    limit: number;
  };
}

// One entry per channel the requesting user can see (General + every
// project they have access to) — projectId null = General.
export interface ChatUnreadChannel {
  projectId: number | null;
  unread: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
