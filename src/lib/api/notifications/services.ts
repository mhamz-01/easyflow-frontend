import { api } from "../client";
import type { ApiResponse, NotificationsPage } from "@/src/types/notifications";

export const notificationService = {
  /**
   * Cursor-paginated notification history for the current workspace/user
   * (workspace resolved server-side from the x-workspace-id header).
   */
  getNotifications: async (params?: {
    cursor?: number;
    limit?: number;
  }): Promise<NotificationsPage> => {
    const response = await api.get<ApiResponse<NotificationsPage>>("/notifications", {
      params,
    });
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ count: number }>>(
      "/notifications/unread-count",
    );
    return response.data.data.count;
  },

  markRead: async (id: number): Promise<boolean> => {
    const response = await api.post<ApiResponse<{ updated: boolean }>>(
      `/notifications/${id}/read`,
    );
    return response.data.data.updated;
  },

  markAllRead: async (): Promise<number> => {
    const response = await api.post<ApiResponse<{ count: number }>>("/notifications/read-all");
    return response.data.data.count;
  },
};
