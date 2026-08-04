// chat/services.ts
import { api } from "../client";
import type {
  ApiResponse,
  ChatAttachment,
  ChatMessage,
  ChatMessagesPage,
} from "@/src/types/chat";

export const chatService = {
  /**
   * Cursor-paginated message history for the current workspace/channel
   * (workspace is resolved server-side from the x-workspace-id header;
   * omit projectId for General, pass it for a project's channel).
   */
  getMessages: async (params?: {
    projectId?: number;
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
   * Send a message to the current workspace/channel — omit projectId for
   * General. content and attachment are each optional but at least one is
   * required (a message can be a bare attachment card).
   */
  sendMessage: async (payload: {
    projectId?: number;
    content?: string;
    attachment?: ChatAttachment;
  }): Promise<ChatMessage> => {
    const response = await api.post<ApiResponse<ChatMessage>>(
      "/chat/messages",
      payload,
    );
    return response.data.data;
  },
};
