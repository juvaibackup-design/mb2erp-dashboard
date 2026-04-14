// Zustand store - useTabStore
import { create } from "zustand";
import Cookies from "js-cookie"; // Import the Cookies library

interface Tab {
  menuName: string;
  id: string;
}

interface TabStore {
  tabs: Tab[];
  activeTab: Tab | null;
  addTab: (tab: Tab) => void;
  removeTab: (menuName: string) => void;
  setActiveTab: (tab: Tab | null) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  tabs: [], // Initial empty array
  activeTab: null, // No active tab initially

  // Add a tab and store it in cookies
  addTab: (tab) => {
    set((state) => {
      const updatedTabs = [...state.tabs, tab];

      // Save the updated tabs array in cookies
      Cookies.set("openTabs", JSON.stringify(updatedTabs), { expires: 7 });

      return { tabs: updatedTabs };
    });
  },

  // Remove a tab and store the updated array in cookies
  removeTab: (menuName) => {
    set((state) => {
      const updatedTabs = state.tabs.filter((tab) => tab.menuName !== menuName);

      // Save the updated tabs array in cookies
      Cookies.set("openTabs", JSON.stringify(updatedTabs), { expires: 7 });

      return { tabs: updatedTabs };
    });
  },

  // Set the active tab
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
