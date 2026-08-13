// lib/api/whiteboards/services.ts


import {
  whiteboardsListResponse,
  singleWhiteboardResponse,
  createdWhiteboardResponse,
  singleWhiteboard,
  whiteboardAccessListResponse,
  grantWhiteboardAccessResponse,
  setWhiteboardDefaultAccessResponse,
  WhiteboardAccessLevel,
} from "@/src/types/whiteboard";
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
  isPrivate,
  defaultAccess,
}: {
  workspaceId: number;
  projectId: number;
  createdBy: string;
  whiteboardName:string;
  isPrivate: boolean;
  defaultAccess?: WhiteboardAccessLevel;
}) => {
  const response = await api.post("/whiteboards/create", {
    workspaceId,
    projectId,
    createdBy,
    whiteboardName,
    isPrivate,
    defaultAccess,
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

// Access-control management — public whiteboards only.
// See GET/POST /whiteboards/:id/access, DELETE /whiteboards/:id/access/:userId,
// PATCH /whiteboards/:id/default-access on the backend.
export const getWhiteboardAccessList = async (whiteboardId: number) => {
  const response = await api.get(`/whiteboards/${whiteboardId}/access`);
  return response.data as whiteboardAccessListResponse;
};

export const grantWhiteboardAccess = async ({
  whiteboardId,
  userId,
  accessLevel,
}: {
  whiteboardId: number;
  userId: number;
  accessLevel: "view" | "edit" | "none";
}) => {
  const response = await api.post(`/whiteboards/${whiteboardId}/access`, {
    userId,
    accessLevel,
  });
  return response.data as grantWhiteboardAccessResponse;
};

export const revokeWhiteboardAccess = async ({
  whiteboardId,
  userId,
}: {
  whiteboardId: number;
  userId: number;
}) => {
  const response = await api.delete(`/whiteboards/${whiteboardId}/access/${userId}`);
  return response.data as { success: boolean };
};

export const setWhiteboardDefaultAccess = async ({
  whiteboardId,
  defaultAccess,
}: {
  whiteboardId: number;
  defaultAccess: WhiteboardAccessLevel;
}) => {
  const response = await api.patch(`/whiteboards/${whiteboardId}/default-access`, {
    defaultAccess,
  });
  return response.data as setWhiteboardDefaultAccessResponse;
};
