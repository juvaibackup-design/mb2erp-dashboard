import { create } from "zustand";

interface eInterface {
  formData: any;
  setFormData: (value: any) => void;
}

export const useEINVOICEStore = create<eInterface>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
}));
