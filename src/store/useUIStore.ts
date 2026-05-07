import { create } from "zustand";

type ModalState = {
  isCreateProjectModalOpen: boolean;
  isAlertProjectModalOpen: boolean;
};

type ModalKey = keyof ModalState;

type UIState = {
  modals: ModalState;
  openModal: (name: ModalKey) => void;
  closeModal: (name: ModalKey) => void;
  resetUI: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  modals: {
    isCreateProjectModalOpen: false,
    isAlertProjectModalOpen: false,
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
      },
    }),
}));