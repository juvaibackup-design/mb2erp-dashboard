import { create } from "zustand";

interface Invoice {
  formData: any;
  setFormData: (value: any) => void;
  isSICreated: boolean;
  setIsSICreated: (value: boolean) => void;
  isSIUpdated: boolean;
  setIsSIUpdated: (value: boolean) => void;
}

export const useInvoiceStore = create<Invoice>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  isSICreated: false,
  setIsSICreated: (value: boolean) => set({ isSICreated: value }),
  isSIUpdated: false,
  setIsSIUpdated: (value: boolean) => set({ isSIUpdated: value }),
}));
