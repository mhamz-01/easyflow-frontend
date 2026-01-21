import { api } from "../client";

/**
 * Delete current authenticated user account
 */
export const deleteUserAccount = async (): Promise<void> => {
  await api.delete("/users/delete");
};
