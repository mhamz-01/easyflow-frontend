import { api } from "../client";

/**
 * get users
 */
export const getUsers = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: number;
  projectId: number;
}) => {
  const response = await api.get("/users", {
    params: { workspaceId, projectId },
  });
  return response.data;
};
/**
 * Delete current authenticated user account
 */
export const deleteUserAccount = async (): Promise<void> => {
  await api.delete("/users/delete");
};
