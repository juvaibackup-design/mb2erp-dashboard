import { create } from "zustand";

interface QCEntryState {
  isFormCreated: boolean;
  setFormCreated: (value: boolean) => void;
  isFormEdited: boolean;
  setFormEdited: (value: boolean) => void;
}

export const useQCEntryStore = create<QCEntryState>((set) => ({
  isFormCreated: false,
  setFormCreated: (value: boolean) => set({ isFormCreated: value }),
  isFormEdited: false,
  setFormEdited: (value: boolean) => set({ isFormEdited: value }),
}));
