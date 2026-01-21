import { create } from "zustand";
import { persist } from "zustand/middleware";

type Document = {
  id: number;
  documentName: string;
};

type DocumentState = {
  document: Document | null;
  setDocument: (project: Document) => void;
  updateDocument: (updates: Partial<Document>) => void;
  clearDocument: () => void;
};

export const useDocumentStore = create(
  persist<DocumentState>(
    (set) => ({
      document: null,

      // Set the whole project object
      setDocument: (document) => set({ document }),

      // Update parts of the project
      updateDocument: (updates) =>
        set((state) => ({
          document: state.document ? { ...state.document, ...updates } : null,
        })),

      // Clear project
      clearDocument: () => set({ document: null }),
    }),
    {
      name: "document-store", // localStorage key
    }
  )
);
