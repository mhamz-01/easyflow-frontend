// tasks/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTask, UpdateTaskDto, Task } from "@/src/types/tasks";
import { toast } from "sonner"; // or your toast library
import { taskService } from "../lib/api/tasks/service";

export const TASK_QUERY_KEYS = {
  all: ["tasks"] as const,
  lists: () => [...TASK_QUERY_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...TASK_QUERY_KEYS.lists(), filters] as const,
  details: () => [...TASK_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...TASK_QUERY_KEYS.details(), id] as const,
  workspace: (workspaceId: number) =>
    [...TASK_QUERY_KEYS.all, "workspace", workspaceId] as const,
  project: (projectId: number) =>
    [...TASK_QUERY_KEYS.all, "project", projectId] as const,
  myTasks: () => [...TASK_QUERY_KEYS.all, "my-tasks"] as const,
};

/**
 * Hook to create a task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: CreateTask) => taskService.createTask(taskData),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });

      toast.success("Task created successfully", {
        description: `"${data.name}" has been created.`,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create task";
      const errors = error?.response?.data?.errors;

      if (errors && errors.length > 0) {
        errors.forEach((err: { field: string; message: string }) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error("Error", { description: message });
      }
    },
  });
}

/**
 * Hook to get task by ID
 */
export function useTask(taskId: number, enabled = true) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(taskId),
    queryFn: () => taskService.getTaskById(taskId),
    enabled: enabled && !!taskId,
  });
}

/**
 * Hook to update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: UpdateTaskDto }) =>
      taskService.updateTask(taskId, data),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      queryClient.setQueryData(TASK_QUERY_KEYS.detail(data.id), data);

      toast.success("Task updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update task";
      toast.error("Error", { description: message });
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      toast.success("Task deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete task";
      toast.error("Error", { description: message });
    },
  });
}

/**
 * Hook to get tasks by workspace
 */
export function useWorkspaceTasks(
  workspaceId: number,
  filters?: {
    projectId?: number;
    state?: string;
    priority?: string;
    assigneeId?: number;
  },
) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.workspace(workspaceId),
    queryFn: () => taskService.getTasksByWorkspace(workspaceId, filters),
    enabled: !!workspaceId,
  });
}

/**
 * Hook to get tasks by project
 */
export function useProjectTasks(projectId: number) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.project(projectId),
    queryFn: () => taskService.getTasksByProject(projectId),
    enabled: !!projectId,
  });
}

/**
 * Hook to get user's assigned tasks
 */
export function useMyTasks(filters?: { state?: string; priority?: string }) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.myTasks(),
    queryFn: () => taskService.getMyTasks(filters),
  });
}

/**
 * Hook to update task state
 */
export function useUpdateTaskState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      state,
    }: {
      taskId: number;
      state: "todo" | "in progress" | "done";
    }) => taskService.updateTaskState(taskId, state),
    onMutate: async ({ taskId, state }) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: TASK_QUERY_KEYS.detail(taskId),
      });

      const previousTask = queryClient.getQueryData<Task>(
        TASK_QUERY_KEYS.detail(taskId),
      );

      if (previousTask) {
        queryClient.setQueryData(TASK_QUERY_KEYS.detail(taskId), {
          ...previousTask,
          state,
        });
      }

      return { previousTask };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(
          TASK_QUERY_KEYS.detail(variables.taskId),
          context.previousTask,
        );
      }
      toast.error("Failed to update task state");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    },
  });
}
