import { create } from "zustand";

interface ShortcutStore {
  sidebarShortcutMode: boolean;
  setSidebarShortcutMode: (on: boolean) => void;
  resetShortcuts: () => void;
}

export const useShortcutStore = create<ShortcutStore>((set) => ({
  sidebarShortcutMode: false,
  setSidebarShortcutMode: (on: boolean) => set({ sidebarShortcutMode: on }),
  resetShortcuts: () => set({ sidebarShortcutMode: false }),
}));
