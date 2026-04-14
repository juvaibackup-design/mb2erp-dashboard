import { create } from "zustand";

interface TAState {
  ALLMODULES: any[];
  SETALLMODULES: (value: any[]) => void;
}

export const useTAStateStore = create<TAState>((set) => ({
  ALLMODULES: [],
  SETALLMODULES: (value: any[]) => set({ ALLMODULES: value }),
}));
