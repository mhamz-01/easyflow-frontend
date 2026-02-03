import { workspaceMembersResponse } from "@/src/types/workspace";
import { api } from "../../client";

export const getWorkspaceMembers = async ({
  workspaceId,
}: {
  workspaceId: number;
}) => {
  const response = await api.get("/workspace/workspaceMembers", {
    params: { workspaceId },
  });
  return response.data as workspaceMembersResponse;
};
