import { api } from "../client";

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  imageUrl: string | null;
}

/**
 * The current authenticated user's own profile row — mainly used to get
 * the internal numeric id (Clerk's session only exposes the clerkId
 * string), e.g. to build a per-user realtime notification topic.
 */
export const getMe = async (): Promise<CurrentUser> => {
  const response = await api.get("/users/me");
  return response.data.data;
};

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
