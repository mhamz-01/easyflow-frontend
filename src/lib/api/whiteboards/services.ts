// lib/api/whiteboards/services.ts


import { whiteboardsListResponse,singleWhiteboardResponse,createdWhiteboardResponse,singleWhiteboard } from "@/src/types/whiteboard";
import { api } from "../client";

// Get Methods
export const getSingleWhiteboard = async (id: number) => {
  const response = await api.get("/whiteboards/single", {
    params: { id },
  });
  return response.data as singleWhiteboardResponse;
};

export const getAllWhiteboards = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: number;
  projectId: number;
}) => {
  const response = await api.get("/whiteboards", {
    params: { projectId, workspaceId },
  });
  return response.data as whiteboardsListResponse;
};

// Post Methods
export const createWhiteboard = async ({
  workspaceId,
  projectId,
  createdBy,
  whiteboardName,
  isPrivate
}: {
  workspaceId: number;
  projectId: number;
  createdBy: string;
  whiteboardName:string;
  isPrivate: boolean;
}) => {
  const response = await api.post("/whiteboards/create", {
    workspaceId,
    projectId,
    createdBy,
    whiteboardName,
    isPrivate
  });
  return response.data as createdWhiteboardResponse;
};

// Put Methods
export const updateWhiteboard = async ({
  id,
  columnName,
  value,
}: {
  id: number;
  columnName: keyof singleWhiteboard;
  value: any;
}) => {
  const response = await api.put("/whiteboards/update", { id, columnName, value });
  return response.data;
};

// Delete Methods
export const deleteWhiteboard = async ({ id }: { id: number }) => {
  const response = await api.delete("/whiteboards/delete", {
    params: { id },
  });
  return response.data as { success: boolean; message: string; id: number };
};

export const assignWhiteboard = async ({
  whiteboardId,
  memberIds,
}: {
  whiteboardId: number;
  memberIds: number[];
}) => {
  const response = await api.post("/whiteboards/assign", { whiteboardId, memberIds });
  return response.data as { success: boolean; assignees: number[] };
};
