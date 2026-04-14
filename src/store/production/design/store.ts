import { create } from "zustand";

interface DesignState {
  service: any;
  setService: (service: any) => void;
  selectedDesign: any;
  setSelectedDesign: (state: any) => void;
  selectedStyleGroup: any;
  setSelectedStyleGroup: (state: any) => void;
  showJobTour: boolean;
  setShowJObTour: (fact: boolean) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  service: null,
  setService: (service: any) => set({ service }),
  selectedDesign: null,
  setSelectedDesign: (state: any) => set({ selectedDesign: state }),
  selectedStyleGroup: null,
  setSelectedStyleGroup: (state: any) => set({ selectedStyleGroup: state }),
  showJobTour: false,
  setShowJObTour: (fact: boolean) => set({ showJobTour: fact }),
}));
