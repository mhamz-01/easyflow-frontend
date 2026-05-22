// tasks/service.ts
import { useProjectStore } from "@/src/store/useProjectStore";
import type {
  Task,
  CreateTask,
  ApiResponse,
  TaskViewList,
  UpdateTaskPayload,
} from "../../../types/tasks";
import { api } from "../client";

const getProjectId = () => {
  const projectId = useProjectStore.getState().project?.id;
  if (projectId == null) {
    throw new Error("Project id is missing in store");
  }
  return projectId;
};

export const taskService = {
  /**
   * Get task by ID
   */
  getTaskById: async (taskId: number): Promise<Task> => {
    const projectId = getProjectId();
    const response = await api.get<ApiResponse<Task>>(
      `/projects/${projectId}/tasks/${taskId}`,
    );
    return response.data.data;
  },

  /**
   * Get tasks
   */
  getTasksByProject: async (
    projectId: number,
    params?: { cursor?: number; limit?: number },
  ): Promise<{
    tasks: TaskViewList[];
    pagination: {
      nextCursor: number | null;
      hasMore: boolean;
      limit: number;
    };
  }> => {
    const query = new URLSearchParams();
    if (params?.cursor) query.set("cursor", String(params.cursor));
    if (params?.limit) query.set("limit", String(params.limit));
    const response = await api.get<
      ApiResponse<{
        tasks: TaskViewList[];
        pagination: {
          nextCursor: number | null;
          hasMore: boolean;
          limit: number;
        };
      }>
    >(`/projects/${projectId}/tasks?${query}`);

    return response.data.data;
  },

  /**
   * Create a new task
   */
  createTask: async (taskData: CreateTask): Promise<Task> => {
    const projectId = getProjectId();
    const response = await api.post<ApiResponse<Task>>(
      `/projects/${projectId}/tasks`,
      taskData,
    );
    return response.data.data;
  },

  /**
   * Update task
   */
  updateTask: async (
    taskId: number,
    taskData: UpdateTaskPayload,
  ): Promise<Task> => {
    const projectId = getProjectId();
    const response = await api.patch<ApiResponse<Task>>(
      `/projects/${projectId}/tasks/${taskId}`,
      taskData,
    );
    return response.data.data;
  },

  /**
   * Delete task
   */
  deleteTask: async (taskId: number): Promise<void> => {
    const projectId = getProjectId();
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
  },
};
