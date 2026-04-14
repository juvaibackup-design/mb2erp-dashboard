import { create } from "zustand";
import Cookies from "js-cookie";

interface AppState {
  trntype: string | null;
  billlist: string | null;
  setTrnType: (type: string | null) => void;
  setBillList: (billlist: string | null) => void;
}

const useAppStore = create<AppState>((set) => ({
  trntype: null,
  billlist: null,
  setTrnType: (type: any) =>
    set((state) => {
      Cookies.set("trntype", type);
      return { trntype: type };
    }),
  setBillList: (billlist: any) =>
    set((state) => {
      Cookies.set("trntype", billlist);
      return { billlist: billlist };
    }),
}));

export default useAppStore;
