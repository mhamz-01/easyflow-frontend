import { create } from "zustand";

export type SettingsTab = "account" | "workspace";
export type SettingsSection = "profile" | "notifications" | "general" | "members";

type SettingsModalState = {
  isOpen: boolean;
  tab: SettingsTab;
  section: SettingsSection;
  openSettings: (options?: { tab?: SettingsTab; section?: SettingsSection }) => void;
  closeSettings: () => void;
  setTab: (tab: SettingsTab) => void;
  setSection: (section: SettingsSection) => void;
};

const defaultSectionForTab: Record<SettingsTab, SettingsSection> = {
  account: "profile",
  workspace: "general",
};

export const useSettingsModalStore = create<SettingsModalState>((set) => ({
  isOpen: false,
  tab: "account",
  section: "profile",

  openSettings: (options) =>
    set((state) => {
      const tab = options?.tab ?? state.tab;
      const section = options?.section ?? defaultSectionForTab[tab];
      return { isOpen: true, tab, section };
    }),

  closeSettings: () => set({ isOpen: false }),

  setTab: (tab) => set({ tab, section: defaultSectionForTab[tab] }),

  setSection: (section) => set({ section }),
}));
