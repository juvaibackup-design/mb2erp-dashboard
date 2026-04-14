import { create } from "zustand";
interface servicehistoryState {
  formData: any;
  setFormData: (state: any) => void;
  storeDetail: any;
  setStoreDetail: (state: any) => void;
}
export const useServiceHistory = create<servicehistoryState>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  storeDetail: null,
  setStoreDetail: (state: any) => set({ storeDetail: state }),
}));
