  // lib/api/documents/services.ts
  import {
    docsListResponse,
    singleDocResponse,
    singleDoc,
    createdDocResponse,
    docAccessListResponse,
    grantDocAccessResponse,
    setDefaultAccessResponse,
    DocAccessLevel,
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

  

  // Update createDoc service
  export const createDoc = async ({
    workspaceId,
    projectId,
    createdBy,
    documentName,
    isPrivate,
    defaultAccess,
  }: {
    workspaceId: number;
    projectId: number;
    createdBy: string;
    documentName: string; // new for name
    isPrivate: boolean;
    defaultAccess?: DocAccessLevel;
  }) => {
    const response = await api.post("/docs/create", {
      workspaceId,
      projectId,
      createdBy,
      documentName, // new for name
      isPrivate,
      defaultAccess,
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


  export const assignDoc = async ({
    docId,
    memberIds,
  }: {
    docId: number;
    memberIds: number[];
  }) => {
    const response = await api.post("/docs/assign", { docId, memberIds });
    return response.data as { success: boolean; assignees: number[] };
  };

  // Access-control management — public documents only.
  // See GET/POST /docs/:id/access, DELETE /docs/:id/access/:userId,
  // PATCH /docs/:id/default-access on the backend.
  export const getDocAccessList = async (docId: number) => {
    const response = await api.get(`/docs/${docId}/access`);
    return response.data as docAccessListResponse;
  };

  export const grantDocAccess = async ({
    docId,
    userId,
    accessLevel,
  }: {
    docId: number;
    userId: number;
    accessLevel: "view" | "edit" | "none";
  }) => {
    const response = await api.post(`/docs/${docId}/access`, {
      userId,
      accessLevel,
    });
    return response.data as grantDocAccessResponse;
  };

  export const revokeDocAccess = async ({
    docId,
    userId,
  }: {
    docId: number;
    userId: number;
  }) => {
    const response = await api.delete(`/docs/${docId}/access/${userId}`);
    return response.data as { success: boolean };
  };

  export const setDefaultAccess = async ({
    docId,
    defaultAccess,
  }: {
    docId: number;
    defaultAccess: DocAccessLevel;
  }) => {
    const response = await api.patch(`/docs/${docId}/default-access`, {
      defaultAccess,
    });
    return response.data as setDefaultAccessResponse;
  };

