import { create } from "zustand";
import { persist } from "zustand/middleware";

type Project = {
  id: number;
  projectName: string;
};

type ProjectState = {
  project: Project | null;
  setProject: (project: Project) => void;
  updateProject: (updates: Partial<Project>) => void;
  clearProject: () => void;
};

export const useProjectStore = create(
  persist<ProjectState>(
    (set) => ({
      project: null,

      // Set the whole project object
      setProject: (project) => set({ project }),

      // Update parts of the project
      updateProject: (updates) =>
        set((state) => ({
          project: state.project ? { ...state.project, ...updates } : null,
        })),

      // Clear project
      clearProject: () => set({ project: null }),
    }),
    {
      name: "project-store", // localStorage key
    }
  )
);
