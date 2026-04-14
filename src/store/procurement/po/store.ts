import { create } from "zustand";

export const usePOStore = create((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  showProcTour: false,
  setShowProcTour: (value: boolean) => set({ showProcTour: value }),
}));
