// chat/services.ts
import { api } from "../client";
import type { ApiResponse, ChatMessage, ChatMessagesPage } from "@/src/types/chat";

export const chatService = {
  /**
   * Cursor-paginated message history for the current workspace
   * (workspace is resolved server-side from the x-workspace-id header).
   */
  getMessages: async (params?: {
    cursor?: number;
    limit?: number;
  }): Promise<ChatMessagesPage> => {
    const response = await api.get<ApiResponse<ChatMessagesPage>>(
      "/chat/messages",
      { params },
    );
    return response.data.data;
  },

  /**
   * Send a message to the current workspace's chat.
   */
  sendMessage: async (content: string): Promise<ChatMessage> => {
    const response = await api.post<ApiResponse<ChatMessage>>(
      "/chat/messages",
      { content },
    );
    return response.data.data;
  },
};
