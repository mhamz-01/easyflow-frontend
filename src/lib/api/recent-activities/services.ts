import { api } from "../client";

// Success response for create
export interface CreateRecentActivityResponse {
  success: true;
  message: string;
  recentActivity: {
    id: number;
    workspaceId: number;
    userId: string;
    title: string;
    type: "DOC" | "WHITEBOARD" | "TASK";
    typeID: number;
    projectID: number;
    lastEditedBy: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Success response for getAll
export interface GetAllRecentActivitiesResponse {
  success: true;
  data: (CreateRecentActivityResponse["recentActivity"] & {
    editor: { username: string; imageUrl?: string } | null;
  })[];
}
export const createRecentActivity = async ({
  workspaceId,
  userId,
  title,
  type,
  typeID,
  projectID,
  lastEditedBy,
}: {
  workspaceId: number;
  userId: string;
  title: string;
  type: "DOC" | "WHITEBOARD" | "TASK";
  typeID: number;
  projectID: number;
  lastEditedBy: string; // ISO date string
}) => {
  const response = await api.post<CreateRecentActivityResponse>(
    "/recentActivities/create",
    {
      workspaceId,
      userId,
      title,
      type,
      typeID,
      projectID,
      lastEditedBy,
    }
  );

  return response.data;
};

export const getAllRecentActivities = async ({
  workspaceId,
  userId,
  limit = 5,
}: {
  workspaceId: number;
  userId: string;
  limit?: number;
}) => {
  const response = await api.get<GetAllRecentActivitiesResponse>(
    "/recentActivities",
    {
      params: {
        workspaceId,
        userId,
        limit,
      },
    }
  );

  return response.data;
};
