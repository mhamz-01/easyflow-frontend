import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskService } from "../lib/api/tasks/service";
import type { CreateTask, UpdateTaskPayload } from "@/src/types/tasks";
import { useTaskStore } from "../app/[workspace_name]/(workspace)/[project_id]/tasks/store/useTaskStore";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const taskKeys = {
  all: () => ["tasks"] as const,
  detail: (id: number) => ["tasks", id] as const,
  project: (id: number) => ["tasks", "project", id] as const,
};

// ─── Shared ───────────────────────────────────────────────────────────────────

interface MutationOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

const handleMutationError = (error: any) => {
  const message = error?.response?.data?.message ?? "Something went wrong";
  const errors: { field: string; message: string }[] =
    error?.response?.data?.errors ?? [];

  if (errors.length > 0) {
    errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
  } else {
    toast.error(message);
  }
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useTask = (taskId: number) => {
  return useQuery({
    queryKey: taskKeys.detail(taskId as number),
    queryFn: () => taskService.getTaskById(taskId as number),
    enabled: !!taskId,
  });
};
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTask) => taskService.createTask(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
      toast.success(`"${data.name}" created`);
    },
    onError: handleMutationError,
  });
};

export const useUpdateTask = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: number;
      payload: UpdateTaskPayload;
    }) => taskService.updateTask(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
      options?.onSuccess?.();
    },
    onError: (error) => {
      handleMutationError(error);
      options?.onError?.();
    },
  });
};


export const useDeleteTask = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => taskService.deleteTask(taskId), // ✅ receives taskId here
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all() });
      toast.success("Task deleted");
      options?.onSuccess?.();
    },
    onError: (error) => {
      handleMutationError(error);
      options?.onError?.();
    },
  });
};
