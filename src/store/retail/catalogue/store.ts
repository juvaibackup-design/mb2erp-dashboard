import { create } from "zustand";

interface CatalogueStore {
  section: string;
  setSection: (sec: string) => void;
  catSummaryData: any;
  setCatSummaryData: (data: any) => void;
  catCustomerId: number | null; // Should be a number, not {}
  setCatCustomerId: (id: number | null) => void;
  tableData1: any[];
  setTableData1: (tableData: any[]) => void;
  tempTableData1: any[];
  setTempTableData1: (tableData: any[]) => void;
  tableData2: any[];
  setTableData2: (tableData: any[]) => void;
  tempTableData2: any[];
  setTempTableData2: (tableData: any[]) => void;
}

export const useCatalogueStore = create<CatalogueStore>((set) => ({
  section: "",
  setSection: (sec) => set({ section: sec }),
  catSummaryData: {},
  setCatSummaryData: (data: any) => set({ catSummaryData: data }),
  catCustomerId: null,
  setCatCustomerId: (id: any) => set({ catCustomerId: id }),
  tableData1: [],
  setTableData1: (data: any[]) => set({ tableData1: data }),
  tempTableData1: [],
  setTempTableData1: (data: any[]) => set({ tempTableData1: data }),
  tableData2: [],
  setTableData2: (data: any[]) => set({ tableData2: data }),
  tempTableData2: [],
  setTempTableData2: (data: any[]) => set({ tempTableData2: data }),
}));
