import { api } from "../../client";
import type { ApiResponse, ChatChannel } from "@/src/types/chat";

export const getChatChannels = async (projectId: number) => {
  const response = await api.get<ApiResponse<{ channels: ChatChannel[] }>>(
    `/chat/projects/${projectId}/channels`,
  );
  return response.data.data.channels;
};

export const createChatChannel = async ({
  projectId,
  name,
}: {
  projectId: number;
  name: string;
}) => {
  const response = await api.post<ApiResponse<ChatChannel>>(
    `/chat/projects/${projectId}/channels`,
    { name },
  );
  return response.data.data;
};

export const renameChatChannel = async ({
  projectId,
  channelId,
  name,
}: {
  projectId: number;
  channelId: number;
  name: string;
}) => {
  const response = await api.patch<ApiResponse<ChatChannel>>(
    `/chat/projects/${projectId}/channels/${channelId}`,
    { name },
  );
  return response.data.data;
};

export const deleteChatChannel = async ({
  projectId,
  channelId,
}: {
  projectId: number;
  channelId: number;
}) => {
  const response = await api.delete<ApiResponse<{ id: number }>>(
    `/chat/projects/${projectId}/channels/${channelId}`,
  );
  return response.data.data;
};
