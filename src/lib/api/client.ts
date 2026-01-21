import Cookies from "js-cookie";
import axios from "axios";

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
