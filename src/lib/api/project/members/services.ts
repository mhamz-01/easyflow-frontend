import { api } from "../../client";
import { ProjectMembersResponse } from "@/src/types/project";

export const getProjectMembers = async (projectId: number) => {
  const response = await api.get(`/project/${projectId}/members`);
  return response.data as ProjectMembersResponse;
};

export const addProjectMember = async ({
  projectId,
  userId,
}: {
  projectId: number;
  userId: number;
}) => {
  const response = await api.post(`/project/${projectId}/members`, { userId });
  return response.data;
};

export const removeProjectMember = async ({
  projectId,
  userId,
}: {
  projectId: number;
  userId: number;
}) => {
  const response = await api.delete(`/project/${projectId}/members/${userId}`);
  return response.data;
};

export const leaveProject = async ({ projectId }: { projectId: number }) => {
  const response = await api.delete(`/project/${projectId}/members/me`);
  return response.data;
};
