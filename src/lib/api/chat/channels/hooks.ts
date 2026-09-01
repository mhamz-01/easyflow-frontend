import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../client";
import {
  getChatChannels,
  createChatChannel,
  renameChatChannel,
  deleteChatChannel,
} from "./services";

export const chatChannelsKeys = {
  all: (projectId: number) => ["chat", "channels", projectId] as const,
};

export const useChatChannels = (projectId: number | null | undefined, enabled = true) => {
  return useQuery({
    queryKey: chatChannelsKeys.all(projectId ?? 0),
    queryFn: () => getChatChannels(projectId!),
    enabled: !!projectId && enabled,
  });
};

export const useCreateChatChannel = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createChatChannel({ projectId, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatChannelsKeys.all(projectId) });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create channel")),
  });
};

export const useRenameChatChannel = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ channelId, name }: { channelId: number; name: string }) =>
      renameChatChannel({ projectId, channelId, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatChannelsKeys.all(projectId) });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to rename channel")),
  });
};

export const useDeleteChatChannel = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channelId: number) => deleteChatChannel({ projectId, channelId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatChannelsKeys.all(projectId) });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to delete channel")),
  });
};
