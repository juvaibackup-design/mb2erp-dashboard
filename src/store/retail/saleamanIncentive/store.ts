import { create } from "zustand";

interface SalesmanState {
  isFormCreated: boolean;
  setFormCreated: (value: boolean) => void;
  isFormEdited: boolean;
  setFormEdited: (value: boolean) => void;
}

export const useSalesmanStore = create<SalesmanState>((set) => ({
  isFormCreated: false,
  setFormCreated: (value: boolean) => set({ isFormCreated: value }),
  isFormEdited: false,
  setFormEdited: (value: boolean) => set({ isFormEdited: value }),
}));
