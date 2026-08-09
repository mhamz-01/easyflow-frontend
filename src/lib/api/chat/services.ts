// chat/services.ts
import { api } from "../client";
import type {
  ApiResponse,
  ChatAttachment,
  ChatMessage,
  ChatMessagesPage,
  ChatUnreadChannel,
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

  /**
   * Soft-delete a message you authored. Server enforces ownership — a 403
   * comes back if it isn't yours.
   */
  deleteMessage: async (messageId: number): Promise<{ id: number; projectId: number | null }> => {
    const response = await api.delete<ApiResponse<{ id: number; projectId: number | null }>>(
      `/chat/messages/${messageId}`,
    );
    return response.data.data;
  },

  /**
   * Unread status for every channel the current user can see in this
   * workspace (General + each accessible project), one call for the whole
   * sidebar + channel rail.
   */
  getUnread: async (): Promise<ChatUnreadChannel[]> => {
    const response = await api.get<ApiResponse<{ channels: ChatUnreadChannel[] }>>(
      "/chat/unread",
    );
    return response.data.data.channels;
  },

  /**
   * Advance the read cursor for a channel — omit projectId for General.
   * lastMessageId is the highest message id already loaded client-side;
   * omit it to let the server resolve the channel's true latest instead.
   */
  markRead: async (payload: {
    projectId?: number;
    lastMessageId?: number;
  }): Promise<{ projectId: number | null; lastReadMessageId: number | null }> => {
    const response = await api.post<
      ApiResponse<{ projectId: number | null; lastReadMessageId: number | null }>
    >("/chat/read", payload);
    return response.data.data;
  },
};
