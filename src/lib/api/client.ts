import Cookies from "js-cookie";
import axios from "axios";
import { useWorkspaceStore } from "@/src/store/workspace";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

// Add interceptor to attach token to every request
api.interceptors.request.use(async (config) => {
  try {
    // get clerk token from cookies and pass it to all our requests
    const token = Cookies.get("__session");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Failed to get Clerk token", err);
  }
  return config;
});

// Attach workspaceId from Zustand — getState() works outside React, no hook needed
api.interceptors.request.use(async (config) => {
  const workspaceId = useWorkspaceStore.getState().workspace?.id;

  if (workspaceId !== null) {
    config.headers["x-workspace-id"] = workspaceId;
  }

  return config;
});