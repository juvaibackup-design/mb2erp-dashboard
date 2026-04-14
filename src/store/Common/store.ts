import { create } from "zustand";

export const useCommonStore = create((set) => ({
  typeEdit: "",
  setTypeEdit: (value: string) => set({ typeEdit: value }),
}));
