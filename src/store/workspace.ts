import { create } from "zustand";
import { persist } from "zustand/middleware";

type Workspace = {
  id: number;
  workspaceSlug: string;
  workspaceName: string;
  admin: string;
};

type WorkspaceState = {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (updates: Partial<Workspace>) => void;
  clearWorkspace: () => void;
};

export const useWorkspaceStore = create(
  persist<WorkspaceState>(
    (set) => ({
      workspace: null,

      // Set the whole workspace object
      setWorkspace: (workspace) => set({ workspace }),

      // Update parts of the workspace
      updateWorkspace: (updates) =>
        set((state) => ({
          workspace: state.workspace
            ? { ...state.workspace, ...updates }
            : null,
        })),

      // Clear workspace
      clearWorkspace: () => set({ workspace: null }),
    }),
    {
      name: "workspace-store", // localStorage key
    }
  )
);
