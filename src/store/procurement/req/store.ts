import { create } from "zustand";

export const useReqStore = create((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  reqConfirm: false,
  setReqConfirm: (value: boolean) => set({ reqConfirm: value }),
  showTour: false,
  setshowTour: (fact: boolean) => set({ showTour: fact }),
}));
