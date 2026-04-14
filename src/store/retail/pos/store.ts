import { create } from "zustand";

interface Product {
  order: any[],
  curr_invoice: any[],
  final_invoice: any[]
}

interface POSState {
  wishListData: any[];
  setWishListData: Function;
  cartData: any[];
  setCartData: Function;
  products: Product;
  setProducts: Function;
  customer: any;
  setCustomer: Function;
};

export const usePOSStore = create<POSState>((set) => ({
  wishListData: [],
  setWishListData: (tableData: any[]) => set({ wishListData: tableData }),
  cartData: [],
  setCartData: (tableData: any[]) => set({ cartData: tableData }),
  products: { order: [], curr_invoice: [], final_invoice: [] },
  setProducts: (product: Product) => set({ products: product }),
  customer: null,
  setCustomer: (customer: any) => set({ customer: customer })
}));