import { create } from "zustand";

interface PrintState {
  selectedPrint: any;
  setSelectedPrint: (value: any) => void;
  selectPrinter: any;
  setSelectPrinter: (value: any) => void;
  printService: any;
  setPrintService: (value: any) => void;
}

const usePrintStore = create<PrintState>((set) => ({
  selectedPrint: null,
  setSelectedPrint: (value) => set({ selectedPrint: value }),
  selectPrinter: null,
  setSelectPrinter: (value) => set({ selectPrinter: value }),
  printService: null,
  setPrintService: (value) => set({ printService: value }),
}));

export default usePrintStore;
