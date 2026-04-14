import { create } from "zustand";

export const useGRTStore = create((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  grtConfirm: false,
  setGrtConfirm: (value: boolean) => set({ grtConfirm: value }),
}));
