import { create } from "zustand";
interface JobreceiveState {
  formData: any;
  setFormData: (state: any) => void;
}
export const useJobreceiveStore = create<JobreceiveState>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
}));
