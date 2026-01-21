// lib/api/documents/services.ts
import { api } from "../client";

export const getAllWhiteboards = async ({
  projectId,
  workspaceId,
}: {
  projectId: number;
  workspaceId: number;
}) => {
  const response = await api.get("/whiteboards", {
    params: { projectId, workspaceId },
  });
  return response.data;
};
