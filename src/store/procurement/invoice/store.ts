import { create } from "zustand";

export const useInvoiceStore = create((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
}));
export const usePaymentStore = create((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
}));
export const useReceiptStore = create((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
}));