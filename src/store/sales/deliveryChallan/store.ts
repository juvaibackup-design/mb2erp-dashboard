import { create } from "zustand";

interface DelivertChallanState {
  formData: any;
  isDCCreated: boolean;
  setIsDCCreated: (value: boolean) => void;
  isDCUpdated: boolean;
  setIsDCUpdated: (value: boolean) => void;
}

export const useDeliveryChallanStore = create<DelivertChallanState>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  isDCCreated: false,
  setIsDCCreated: (value: boolean) => set({ isDCCreated: value }),
  isDCUpdated: false,
  setIsDCUpdated: (value: boolean) => set({ isDCUpdated: value }),
}));
