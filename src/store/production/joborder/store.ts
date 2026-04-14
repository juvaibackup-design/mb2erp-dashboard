import { create } from "zustand";

interface JoborderState {
  openModalJR: boolean;
  setOpenModalJR: (state: any) => void;
  formData: any;
  setFormData: (state: any) => void;
  showTour: Boolean;
  setshowTour: (state: any) => void;
}

export const useJoborderStore = create<JoborderState>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  openModalJR: false,
  setOpenModalJR: (state: any) => set({ openModalJR: state }),
  showTour: false,
  setshowTour: (state: any) => set({ showTour: state }),
}));
