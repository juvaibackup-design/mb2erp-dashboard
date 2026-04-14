import { create } from "zustand";

interface User {
  type: string,
  channel: string,
  partyId: string
}

interface SupportStore {
  user: User | null,
  setUser: (data: User | null) => void
}

const useSupportStore = create<SupportStore>((set) => ({
  user: null,
  setUser: (data: User | null) => set({ user: data })
}));

export default useSupportStore;