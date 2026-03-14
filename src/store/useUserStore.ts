import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/api/client";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  clearUser: () => void;
  initializeUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      isLoading: false,

      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      clearUser: () => set({ user: null, isAdmin: false }),

      initializeUser: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get("/auth/me");
          set({ user: data.user, isAdmin: data.isAdmin });
        } catch {
          set({ user: null, isAdmin: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "user-store",
    },
  ),
);
