import { create } from "zustand";

interface Quote {
  formData: any;
  setFormData: (value: any) => void;
  isSQCreated: boolean;
  setIsSQCreated: (value: boolean) => void;
  isSQUpdated: boolean;
  setIsSQUpdated: (value: boolean) => void;
   showSalesTour: boolean;
  setShowSalesTour: (value: boolean) => void;
}

export const useQuoteStore = create<Quote>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  isSQCreated: false,
  setIsSQCreated: (value: boolean) => set({ isSQCreated: value }),
  isSQUpdated: false,
  setIsSQUpdated: (value: boolean) => set({ isSQUpdated: value }),
  showSalesTour: false,
  setShowSalesTour: (value: boolean) => set({ showSalesTour: value }),
}));
