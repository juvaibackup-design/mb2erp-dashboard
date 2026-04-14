import { create } from "zustand";

export const useGRNStore = create((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  grnConfirm: false,
  setGrnConfirm: (value: boolean) => set({ grnConfirm: value }),
}));
