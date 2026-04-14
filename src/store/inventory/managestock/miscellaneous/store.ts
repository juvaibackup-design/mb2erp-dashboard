import { create } from "zustand";

interface ManagestockFormStore {
  tab: number;
  setTab: (tab: number) => void;
  formSubmitted: boolean;
  setFormSubmitted: (fact: boolean) => void;
  formSubmittedMsg: string;
  setFormSubmittedMsg: (msg: string) => void;
  showToast: string;
  setShowToast: (val: string) => void;
  showTour: boolean;
  setshowTour: (fact: boolean) => void;
}

export const useManagestockFormStore = create<ManagestockFormStore>((set) => ({
  tab: 0,
  setTab: (tab: number) => set({ tab: tab }),
  formSubmitted: false,
  setFormSubmitted: (fact: boolean) => set({ formSubmitted: fact }),
  formSubmittedMsg: "",
  setFormSubmittedMsg: (msg: string) => set({ formSubmittedMsg: msg }),
  showToast: "",
  setShowToast: (val: string) => set(() => ({ showToast: val })),
  showTour: false,
  setshowTour: (fact: boolean) => set({ showTour: fact }),
}));
