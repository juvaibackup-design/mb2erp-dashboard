import { create } from "zustand";

interface SalesManState {
  avatarImage: string | null;
  setAvatarImage: (value: string | null) => void;
}

export const useSalesManStore = create<SalesManState>((set) => ({
  avatarImage: null,
  setAvatarImage: (value: string | null) => set({ avatarImage: value }),
}));
