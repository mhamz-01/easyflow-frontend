import { WORKSPACE_API } from "./constants";
import { api, getApiErrorMessage } from "../client";
import { NewWorkspaceCreated } from "@/src/types/workspace";

// GET Methods
export const getSingleWorkspace = async (workspaceSlug: string) => {
  const response = await api.get(WORKSPACE_API.GET_SINGLE_WORKSPACE, {
    params: { workspaceSlug },
  });
  return response.data;
};

export const getWorkspaces = async () => {
  try {
    const response = await api.get(WORKSPACE_API.GET_USER_WORKSPACES);
    return response.data ?? []; // default to empty array
  } catch (error) {
    console.error("Error getting workspace for user:", error);
    return [];
  }
};
// make an api call to "/workspace/check" it will return response whether the user have created workspace or not
// Errors are intentionally left to propagate (not swallowed) so the caller
// can tell "user not provisioned yet, keep retrying" (404) apart from a
// real failure, and can show real feedback instead of a silent fake success.
export const checkUserWorkspace = async () => {
  const response = await api.get(WORKSPACE_API.CHECK);
  return response.data; // { success: true, hasWorkspace: boolean, workspaceSlug?: string }
};

// POST Methods
/**
 * Create a new workspace
 * @param workspaceName - Name of the workspace to create
 * @returns The newly created workspace data
 */
export const createWorkspace = async (
  workspaceName: string
): Promise<NewWorkspaceCreated> => {
  try {
    const response = await api.post<NewWorkspaceCreated>(WORKSPACE_API.CREATE, {
      workspaceName,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating workspace:", error);
    // Throw error so callers can handle it (e.g., mutation onError) —
    // preserve the backend's message when there is one instead of masking it.
    throw new Error(
      getApiErrorMessage(error, "Failed to create workspace. Please try again.")
    );
  }
};

// PUT Methods
export const updateWorkspaceName = async (
  workspaceSlug: string,
  newWorkspaceName: string
) => {
  const response = await api.put(WORKSPACE_API.UPDATE_WORKSPACE_NAME, null, {
    params: { workspaceSlug, newWorkspaceName },
  });

  return response.data;
};

// DELETE Methods
export const deleteWorkspace = async (workspaceSlug: string) => {
  console.log("workspace slug in frotnend", workspaceSlug);
  const response = await api.delete(WORKSPACE_API.DELETE_WORKSPACE, {
    params: { workspaceSlug },
  });
  return response.data;
};
