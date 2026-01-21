import { create } from "zustand";
import { persist } from "zustand/middleware";

type ModalState = {
  isCreateProjectModalOpen: boolean;
  isAlertProjectModalOpen: boolean;
  isDeleteDocModalOpen: boolean;
};

type ModalKey = keyof ModalState;

type UIState = {
  modals: ModalState;
  openModal: (name: ModalKey) => void;
  closeModal: (name: ModalKey) => void;
  resetUI: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      modals: {
        isCreateProjectModalOpen: false,
        isAlertProjectModalOpen: false,
        isDeleteDocModalOpen: false,
      },

      openModal: (name) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [name]: true,
          },
        })),

      closeModal: (name) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [name]: false,
          },
        })),

      resetUI: () =>
        set({
          modals: {
            isCreateProjectModalOpen: false,
            isAlertProjectModalOpen: false,
            isDeleteDocModalOpen: false,
          },
        }),
    }),
    {
      name: "ui-store",
    }
  )
);
