// lib/api/documents/services.ts
import {
  docsListResponse,
  singleDocResponse,
  singleDoc,
  createdDocResponse,
} from "@/src/types/documents";
import { api } from "../client";

// Get Methods
export const getSingleDoc = async (id: number) => {
  const response = await api.get("/docs/single", {
    params: { id },
  });
  return response.data as singleDocResponse;
};
export const getAllDocs = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: number;
  projectId: number;
}) => {
  const response = await api.get("/docs", {
    params: { projectId, workspaceId },
  });
  return response.data as docsListResponse;
};

// Post Methods
export const createDoc = async ({
  workspaceId,
  projectId,
  createdBy,
}: {
  workspaceId: number;
  projectId: number;
  createdBy: string;
}) => {
  const response = await api.post("/docs/create", {
    workspaceId,
    projectId,
    createdBy,
  });

  return response.data as createdDocResponse;
};

// PUT Methods
export const updateDoc = async ({
  id,
  columnName,
  value,
}: {
  id: number;
  columnName: keyof singleDoc;
  value: any;
}) => {
  const response = await api.put("/docs/update", { id, columnName, value });
  return response.data;
};
// Delete Methods
// delete doc using its id
export const deleteDoc = async ({ id }: { id: number }) => {
  console.log("id", id);
  const response = await api.delete("/docs/delete", {
    params: { id },
  });
  return response.data as { success: boolean; message: string; id: number };
};
