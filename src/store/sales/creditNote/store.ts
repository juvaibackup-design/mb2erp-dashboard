import { SalesOrderForm } from "@/lib/interfaces/sales/salesOrderInterface";
import { SalesReturnForm } from "@/lib/interfaces/sales/salesReturnInterface";
import { create } from "zustand";

interface CreditNoteState {
  formData: SalesReturnForm | null;
  setFormData: (value: SalesReturnForm) => void;
  isCNCreated: boolean;
  setIsCNCreated: (value: boolean) => void;
  isCNUpdated: boolean;
  setIsCNUpdated: (value: boolean) => void;
}

export const useCreditNoteStore = create<CreditNoteState>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  isCNCreated: false,
  setIsCNCreated: (value: boolean) => set({ isCNCreated: value }),
  isCNUpdated: false,
  setIsCNUpdated: (value: boolean) => set({ isCNUpdated: value }),
}));
