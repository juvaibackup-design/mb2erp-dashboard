import { createStore } from "zustand";

interface SidebarStore {
  openComp: string;
  setOpenComp: (page: string) => void
}

const sidebarStore = createStore<SidebarStore>((set) => ({
  openComp: "",
  setOpenComp: (page: string) => set({ openComp: page })
}))

export default sidebarStore;