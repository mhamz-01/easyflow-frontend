import { create } from "zustand";
import { persist } from "zustand/middleware";

type Whiteboard = {
  id: number;
  whiteboardName: string;
};

type WhiteboardState = {
  whiteboard: Whiteboard | null;
  setWhiteboard: (whiteboard: Whiteboard) => void;
  updateWhiteboard: (updates: Partial<Whiteboard>) => void;
  clearWhiteboard: () => void;
};

export const useWhiteboardStore = create(
  persist<WhiteboardState>(
    (set) => ({
      whiteboard: null,
      setWhiteboard: (whiteboard) => set({ whiteboard }),
      updateWhiteboard: (updates) =>
        set((state) => ({
          whiteboard: state.whiteboard ? { ...state.whiteboard, ...updates } : null,
        })),
      clearWhiteboard: () => set({ whiteboard: null }),
    }),
    {
      name: "whiteboard-store",
    }
  )
);