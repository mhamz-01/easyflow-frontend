import {
  AcceptInvitationPayload,
  AcceptInvitationResponse,
  deleteInvitationResponse,
  UserWorkspaceInvitesResponse,
  WorkspaceInvitesResponse,
} from "@/src/types/workspace";
import { api } from "../../client";

export const sendInvite = async ({
  workspaceId,
  email,
  role,
}: {
  workspaceId: number;
  email: string;
  role: string;
}) => {
  const response = await api.post("/workspace/invite", {
    workspaceId,
    email,
    role,
  });
  return response.data;
};

// list all pending invites
export const getPendingWorkspaceInvites = async ({
  workspaceId,
}: {
  workspaceId: number;
}) => {
  const response = await api.get("/workspace/invites", {
    params: { workspaceId },
  });
  return response.data as WorkspaceInvitesResponse;
};

export const getUserWorkspaceInvitesByEmail = async ({
  email,
}: {
  email: string;
}) => {
  console.log("api cal triggered", email);
  const response = await api.get("/workspace/user/invites", {
    params: { email },
  });
  return response.data as UserWorkspaceInvitesResponse;
};

export const acceptInvitation = async ({
  token,
}: AcceptInvitationPayload): Promise<AcceptInvitationResponse> => {
  const response = await api.post("/workspace/invite/accept", {
    token,
  });
  return response.data;
};

// delete invitation using id OR token
export const deleteInvitation = async ({
  id,
  token,
}: {
  id?: number;
  token?: string;
}) => {
  const response = await api.delete("/workspace/invite/delete", {
    params: { id, token },
  });
  return response.data as deleteInvitationResponse;
};
