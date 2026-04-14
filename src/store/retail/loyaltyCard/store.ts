import { create } from "zustand";

interface LoyaltyCardState {
  isFormCreated: boolean;
  setFormCreated: (value: boolean) => void;
  isFormEdited: boolean;
  setFormEdited: (value: boolean) => void;
  suffixOptions: { suffix: string }[];
}

export const useLoyaltyCardStore = create<LoyaltyCardState>((set) => ({
  isFormCreated: false,
  setFormCreated: (value: boolean) => set({ isFormCreated: value }),
  isFormEdited: false,
  setFormEdited: (value: boolean) => set({ isFormEdited: value }),
  suffixOptions: [],
}));
