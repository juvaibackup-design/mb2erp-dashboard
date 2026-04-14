import { create } from "zustand";

interface SalesPartner {
  partyType: string;
  setPartyType: (value: string) => void;
  isSPCreated: boolean;
  setIsSPCreated: (value: boolean) => void;
  isSPEdited: boolean;
  setIsSPEdited: (value: boolean) => void;
}

export const useSalesPartnerStore = create<SalesPartner>((set) => ({
  partyType: "customer",
  setPartyType: (value: string) => set({ partyType: value }),
  isSPCreated: false,
  setIsSPCreated: (value: boolean) => set({ isSPCreated: value }),
  isSPEdited: false,
  setIsSPEdited: (value: boolean) => set({ isSPEdited: value }),
}));
