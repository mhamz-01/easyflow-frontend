export type NotificationType = "TASK_ASSIGNED" | "TASK_STATUS_CHANGED" | "TASK_DUE_CHANGED";

export interface NotificationActor {
  id: number;
  username: string;
  imageUrl?: string | null;
}

export interface AppNotification {
  id: number;
  workspaceId: number;
  recipientUserId: number;
  type: NotificationType;
  taskId: number | null;
  projectId: number | null;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  actor: NotificationActor | null;
}

export interface NotificationsPage {
  notifications: AppNotification[];
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
