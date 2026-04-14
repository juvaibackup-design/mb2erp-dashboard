// store/formStore.ts
import { create } from "zustand";

interface FormState {
  isTransactionDirty: boolean;
  setTransactionDirty: (dirty: boolean) => void;
}

export const useFormStore = create<FormState>((set) => ({
  isTransactionDirty: false,
  setTransactionDirty: (dirty) => set({ isTransactionDirty: dirty }),
}));
