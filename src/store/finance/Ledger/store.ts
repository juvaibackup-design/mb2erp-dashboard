import { create } from "zustand";


interface FinanceFormStore {

  showTour: boolean;
  setshowTour: (fact: boolean) => void;
}
export const useFinanceFormStore = create<FinanceFormStore>((set) => ({

  showTour: false,
  setshowTour: (fact: boolean) => set({ showTour: fact }),
}));