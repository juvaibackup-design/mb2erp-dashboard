import { SalesOrderForm } from "@/lib/interfaces/sales/salesOrderInterface";
import { create } from "zustand";

interface SalesOrderState {
  formData: SalesOrderForm | null;
  setFormData: (value: SalesOrderForm) => void;
  isSOCreated: boolean;
  setIsSOCreated: (value: boolean) => void;
  isSOUpdated: boolean;
  setIsSOUpdated: (value: boolean) => void;
}

export const useSalesOrderStore = create<SalesOrderState>((set) => ({
  formData: null,
  setFormData: (state: any) => set({ formData: state }),
  isSOCreated: false,
  setIsSOCreated: (value: boolean) => set({ isSOCreated: value }),
  isSOUpdated: false,
  setIsSOUpdated: (value: boolean) => set({ isSOUpdated: value }),
}));
