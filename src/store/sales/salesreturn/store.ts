import { SalesOrderForm } from "@/lib/interfaces/sales/salesOrderInterface";
import { SalesReturnForm } from "@/lib/interfaces/sales/salesReturnInterface";
import { create } from "zustand";

interface SalesReturnState {
  formData: SalesReturnForm | null;
  setFormData: (value: SalesReturnForm) => void;
  isSRCreated: boolean;
  setIsSRCreated: (value: boolean) => void;
  isSRUpdated: boolean;
  setIsSRUpdated: (value: boolean) => void;
}

export const useSalesReturnStore = create<SalesReturnState>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  isSRCreated: false,
  setIsSRCreated: (value: boolean) => set({ isSRCreated: value }),
  isSRUpdated: false,
  setIsSRUpdated: (value: boolean) => set({ isSRUpdated: value }),
}));
