import { WORKSPACE_API } from "./constants";
import { api } from "../client";
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
export const checkUserWorkspace = async () => {
  try {
    const response = await api.get(WORKSPACE_API.CHECK);
    return response.data; // { success: true, hasWorkspace: boolean, workspaceSlug?: string }
  } catch (error) {
    console.error("Error checking workspace:", error);
    return { success: false, hasWorkspace: false };
  }
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
    // Throw error so callers can handle it (e.g., mutation onError)
    throw new Error("Failed to create workspace");
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
