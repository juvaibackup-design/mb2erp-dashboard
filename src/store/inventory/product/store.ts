import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
  // counts
  checkedCounts: Record<string, number>;
  rangeFilterCount: number;
  dateFilterCount: number;
  // totalCheckedCount: number;

  // setters
  setCheckedCounts: (counts: Record<string, number>) => void;
  setRangeFilterCount: (count: number) => void;
  // setDateFilterCount: (count: number) => void;
  setDateFilterCount: (next: number | ((prev: number) => number)) => void;

  // setTotalCheckedCount: (count: number) => void;

  selectedDocType: string | null;
  setSelectedDocType: (docType: string | null) => void;

  isDocApi: boolean;
  setIsDocApi: (isDocApi: boolean) => void;

  totalCheckedCount: number;
  setTotalCheckedCount: (count: number) => void;

  filtersData: Record<string, string>;
  setFiltersData: (
    next:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void;
  resetFiltersData: () => void;

  filters: any[];
  setFilters: (next: any[] | ((prev: any[]) => any[])) => void;
  resetFilters: () => void;

  images: any[];
  setImages: (images: any[]) => void;

  allCategory: any[];
  setAllCategory: (allCategory: any[]) => void;

  barcodeHistoryColumnChooserData: any[];
  setBarcodeHistoryColumnChooserData: (data: any[]) => void;

  search: string;
  setSearch: (search: string) => void;

  isSearch: boolean;
  setIsSearch: (isSearch: boolean) => void;

  conditions: string[];
  setConditions: (next: string[] | ((prev: string[]) => string[])) => void;

  showAdvancedSearch: boolean;
  setShowAdvancedSearch: (showAdvancedSearch: boolean) => void;

  resetStore: () => void;
  resetProductListFilters: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      checkedCounts: {},
      rangeFilterCount: 0,
      dateFilterCount: 0,
      // totalCheckedCount: 0,

      setCheckedCounts: (counts) => set({ checkedCounts: counts }),
      setRangeFilterCount: (count) => set({ rangeFilterCount: count }),
      // setDateFilterCount: (count) => set({ dateFilterCount: count }),
      setDateFilterCount: (next) =>
        set((state) => ({
          dateFilterCount:
            typeof next === "function"
              ? (next as (p: number) => number)(state.dateFilterCount)
              : next,
        })),
      // setTotalCheckedCount: (count) => set({ totalCheckedCount: count }),

      selectedDocType: null,
      setSelectedDocType: (selectedDocType) => set({ selectedDocType }),

      isDocApi: false,
      setIsDocApi: (isDocApi) => set({ isDocApi }),

      totalCheckedCount: 0,
      setTotalCheckedCount: (count) => set({ totalCheckedCount: count }),

      filtersData: {},
      setFiltersData: (next) =>
        set((state) => ({
          filtersData:
            typeof next === "function" ? next(state.filtersData) : next,
        })),
      resetFiltersData: () => set({ filtersData: {} }),

      // --------------------
      // FILTERS
      // --------------------
      filters: [],
      setFilters: (next) =>
        set((state) => ({
          filters:
            typeof next === "function"
              ? (next as (prev: any[]) => any[])(state.filters)
              : next,
        })),
      resetFilters: () => set({ filters: [] }),

      // --------------------
      // SEARCH
      // --------------------
      search: "",
      setSearch: (search) => set({ search }),

      isSearch: false,
      setIsSearch: (isSearch) => set({ isSearch }),

      // --------------------
      // IMAGES
      // --------------------
      images: [],
      setImages: (images) => set({ images }),

      // --------------------
      // CATEGORY DATA
      // --------------------
      allCategory: [],
      setAllCategory: (allCategory) => set({ allCategory }),

      barcodeHistoryColumnChooserData: [],
      setBarcodeHistoryColumnChooserData: (data) =>
        set({ barcodeHistoryColumnChooserData: data }),

      // --------------------
      // CONDITIONS
      // --------------------
      conditions: [],
      setConditions: (next) =>
        set((state) => ({
          conditions:
            typeof next === "function"
              ? (next as (prev: string[]) => string[])(state.conditions)
              : next,
        })),

      // --------------------
      // UI FLAGS
      // --------------------
      showAdvancedSearch: false,
      setShowAdvancedSearch: (showAdvancedSearch) =>
        set({ showAdvancedSearch }),

      // --------------------
      // FULL RESET (logout / hard reset)
      // --------------------
      resetStore: () =>
        set({
          selectedDocType: null,
          filters: [],
          filtersData: {},
          totalCheckedCount: 0,
          images: [],
          allCategory: [],
          barcodeHistoryColumnChooserData: [],
          search: "",
          isSearch: false,
          conditions: [],
          showAdvancedSearch: false,
        }),
      resetProductListFilters: () =>
        set({
          checkedCounts: {},
          rangeFilterCount: 0,
          dateFilterCount: 0,
          selectedDocType: null,
          isDocApi: false,
          totalCheckedCount: 0,
          filtersData: {},
          filters: [],
          search: "",
          isSearch: false,
          conditions: [],
          showAdvancedSearch: false,
        }),
    }),

    // Persist only what is needed

    {
      name: "product-store", // localStorage key
      partialize: (state) => ({
        // Persist only what is needed
        selectedDocType: state.selectedDocType,
        filters: state.filters,
        filtersData: state.filtersData,
        totalCheckedCount: state.totalCheckedCount,
        search: state.search,
        isSearch: state.isSearch,
        conditions: state.conditions,
      }),
    }
  )
);

// import { create } from "zustand";

// interface ProductStore {
//   filters: any[];
//   setFilters: (next: any[] | ((prev: any[]) => any[])) => void;

//   images: any[];
//   setImages: (images: any[]) => void;
//   allCategory: any[];
//   setAllCategory: (allCategory: any[]) => void;
//   barcodeHistoryColumnChooserData: any[];
//   setBarcodeHistoryColumnChooserData: (
//     barcodeHistoryColumnChooserData: any[]
//   ) => void;
//   search: string;
//   setSearch: (search: string) => void;
//   isSearch: boolean;
//   setIsSearch: (isSearch: boolean) => void;
//   conditions: string[];
//   setConditions: (
//     next: string[] | ((prev: string[]) => string[]) // supports functional updates too
//   ) => void;
//   showAdvancedSearch: boolean;
//   setShowAdvancedSearch: (showAdvancedSearch: boolean) => void;
// }

// export const useProductStore = create<ProductStore>((set) => ({
//   filters: [],
//   setFilters: (next) =>
//     set((state) => ({
//       filters: typeof next === "function" ? (next as any)(state.filters) : next,
//     })),

//   search: "",
//   setSearch: (search: string) => set({ search }),
//   images: [],
//   setImages: (images: any[]) => set({ images }),
//   allCategory: [],
//   setAllCategory: (allCategory: any[]) => set({ allCategory }),
//   barcodeHistoryColumnChooserData: [],
//   setBarcodeHistoryColumnChooserData: (
//     barcodeHistoryColumnChooserData: any[]
//   ) => set({ barcodeHistoryColumnChooserData }),
//   isSearch: false,
//   setIsSearch: (isSearch: boolean) => set({ isSearch }),
//   conditions: [],
//   setConditions: (next) =>
//     set((state) => ({
//       conditions:
//         typeof next === "function" ? (next as any)(state.conditions) : next,
//     })),
//   showAdvancedSearch: false,
//   setShowAdvancedSearch: (showAdvancedSearch: boolean) =>
//     set({ showAdvancedSearch }),
// }));
