import { create } from "zustand";

interface ToastAssortment {
  toastMessage: string | null;
  setToastMessage: (msg: string) => void;
  clearToastMessage: () => void;
}

export const useToastStore = create<ToastAssortment>((set) => ({
  toastMessage: null,
  setToastMessage: (msg) => set({ toastMessage: msg }),
  clearToastMessage: () => set({ toastMessage: null }),
}));
