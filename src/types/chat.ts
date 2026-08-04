// chat/types.ts
export interface ChatAuthor {
  id: number;
  username: string;
  email: string;
  imageUrl?: string | null;
}

export interface ChatMessage {
  id: number;
  workspaceId: number;
  userId: number;
  content: string;
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: ChatAuthor;
}

export interface ChatMessagesPage {
  messages: ChatMessage[];
  pagination: {
    nextCursor: number | null;
    hasMore: boolean;
    limit: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
