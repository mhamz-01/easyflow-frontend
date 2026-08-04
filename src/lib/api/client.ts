import Cookies from "js-cookie";
import axios from "axios";
import { useWorkspaceStore } from "@/src/store/workspace";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  // Bound every request so a stuck backend call surfaces as an error
  // instead of leaving the UI spinning indefinitely.
  timeout: 20000,
});

// Status code of a failed request, if it's an axios error with a response.
// Lets callers tell "not ready yet" (404) apart from real failures.
export const getApiErrorStatus = (error: unknown): number | undefined => {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
};

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