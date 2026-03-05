import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isAdmin: boolean;

  // Actions
  setUser: (user: User) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,

      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      clearUser: () => set({ user: null, isAdmin: false }),
    }),
    {
      name: "user-store",
    },
  ),
);
