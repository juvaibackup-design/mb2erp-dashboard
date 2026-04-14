import { create } from "zustand";

interface AccountGroup {
  inputValue: any;
  setInputValue: (state: any) => void;
}

export const useAccountGroup = create<AccountGroup>((set) => ({
  inputValue: null,
  setInputValue: (state: any) => set({ inputValue: state }),
}));
