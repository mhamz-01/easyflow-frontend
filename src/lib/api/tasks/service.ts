// tasks/service.ts
import type {
  Task,
  CreateTask,
  UpdateTaskDto,
  ApiResponse,
  TaskViewList,
} from "../../../types/tasks";
import { api } from "../client";

export const taskService = {
  /**
   * Create a new task
   */
  createTask: async (taskData: CreateTask): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>(
      `/projects/${7}/tasks`,
      taskData,
    );
    return response.data.data;
  },

  /**
   * Get task by ID
   */
  getTaskById: async (taskId: number): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${taskId}`);
    return response.data.data;
  },

  /**
   * Update task
   */
  updateTask: async (
    taskId: number,
    taskData: UpdateTaskDto,
  ): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(
      `/tasks/${taskId}`,
      taskData,
    );
    return response.data.data;
  },

  /**
   * Delete task
   */
  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },

  /**
   * Get tasks by project
   */
  getTasksByProject: async (projectId: number): Promise<TaskViewList[]> => {
    const response = await api.get<ApiResponse<TaskViewList[]>>(
      `/projects/${projectId}/tasks`,
    );
    return response.data.data;
  },

  /**
   * Get user's assigned tasks
   */
  getMyTasks: async (params?: {
    state?: string;
    priority?: string;
  }): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>("/tasks/my-tasks", {
      params,
    });
    return response.data.data;
  },

  /**
   * Assign users to task
   */
  assignUsers: async (taskId: number, userIds: number[]): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>(
      `/tasks/${taskId}/assignees`,
      { userIds },
    );
    return response.data.data;
  },

  /**
   * Update task state
   */
  updateTaskState: async (
    taskId: number,
    state: "todo" | "in progress" | "done",
  ): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(
      `/tasks/${taskId}/state`,
      { state },
    );
    return response.data.data;
  },
};
