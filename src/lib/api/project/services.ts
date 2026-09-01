import { api } from "../client";
import { CreateProjectVariables, newProjectProps } from "./types";

export const createProject = async ({
  projectName,
  workspaceId,
  admin,
}: CreateProjectVariables): Promise<newProjectProps> => {
  const response = await api.post("/project/create", {
    projectName,
    workspaceId,
    admin,
  });
  return response.data;
};

// export const getProjectsByWorkspaceId = async (workspaceId: number) => {
//   const response = await api.get(`/project`, {
//     params: { workspaceId },
//   });

//   return response.data;
// };

export const getProjectsByWorkspaceSlug = async (slug: string) => {
  const response = await api.get(`/project`, {
    params: { slug },
  });

  return response.data;
};

// delete a project
export const deleteProject = async ({
  projectId,
}: {
  projectId: number;
}): Promise<void> => {
  await api.delete("/project/delete", {
    params: { projectId }, // must be an object
  });
};

// Currently only used to flip public <-> private.
export const updateProject = async ({
  projectId,
  type,
}: {
  projectId: number;
  type: "public" | "private";
}) => {
  const response = await api.patch(`/project/${projectId}`, { type });
  return response.data as { success: boolean; project: { id: number; name: string; type: "public" | "private" } };
};
