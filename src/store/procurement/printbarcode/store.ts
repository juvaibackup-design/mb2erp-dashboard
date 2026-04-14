import { create } from "zustand";

interface PBStore {
  printFormData: any;
  setPrintFormData: (data: any) => void;
  resetPrintFormData: () => void;
}
export const usePBStore = create<PBStore>((set) => ({
  printFormData: null,
  setPrintFormData: (state: any) => set({ printFormData: state }),
  resetPrintFormData: () => set({ printFormData: null }),
}));
