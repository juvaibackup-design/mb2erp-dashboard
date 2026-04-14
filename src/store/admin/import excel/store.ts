import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ImportExcelState {
  origin: string;
  setOrigin: (point: string) => void;
  stockpoint1: number | null;
  setStockpoint1: (point: number | null) => void;
  stockpoint2: number | null;
  setStockpoint2: (point: number | null) => void;
  vendor: string;
  setVendor: (name: string) => void;
  poType: string;
  setPoType: (name: string) => void;
  tabledata: Array<any>;
  setTabledata: (data: any[]) => void;
  type: string | null;
  setType: (name: string | null) => void;
  customerCode: any;
  setCustomerCode: (point: any) => void;
  dctype: any;
  setDcType: (name: any) => void;
  buyer: any;
  setBuyer: (name: any) => void;
  customerId: any;
  setCustomerId: (name: any) => void;
  planCode: any;
  setPlanCode: (name: any) => void;
}

export const useImportExcel = create<ImportExcelState>()(
  persist(
    (set) => ({
      origin: "",
      setOrigin: (url: string) => set({ origin: url }),
      stockpoint1: null,
      setStockpoint1: (point: number | null) => set({ stockpoint1: point }),
      stockpoint2: null,
      setStockpoint2: (point: number | null) => set({ stockpoint2: point }),
      vendor: "",
      setVendor: (name: string) => set({ vendor: name }),
      poType: "",
      setPoType: (data: string) => set({ poType: data }),
      tabledata: [],
      setTabledata: (data: any[]) => set({ tabledata: data }),
      type: null,
      setType: (name: string | null) => set({ type: name }),
      customerCode: null,
      setCustomerCode: (point: any) => set({ customerCode: point }),
      dctype: "",
      setDcType: (name: any) => set({ dctype: name }),
      buyer: "",
      setBuyer: (name: any) => set({ buyer: name }),
      customerId: null,
      setCustomerId: (name: any) => set({ customerId: name }),
      planCode: null,
      setPlanCode: (name: any) => set({ planCode: name }),
    }),
    {
      name: "import-excel-storage", // Unique storage key
      getStorage: () => sessionStorage,
      partialize: (state) => ({
        origin: state.origin,
        poType: state.poType,
      }),
    }
  )
);
