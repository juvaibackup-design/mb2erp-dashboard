import { create } from "zustand";

interface CollectionRefundState {
  isFormCreated: boolean;
  setFormCreated: (value: boolean) => void;
  isFormEdited: boolean;
  setFormEdited: (value: boolean) => void;
}

export const useCollecitonRefundStore = create<CollectionRefundState>(
  (set) => ({
    isFormCreated: false,
    setFormCreated: (value: boolean) => set({ isFormCreated: value }),
    isFormEdited: false,
    setFormEdited: (value: boolean) => set({ isFormEdited: value }),
  })
);
