import { create } from "zustand";

interface LoginStore {
  formDirty: boolean;
  setFormDirty: (fact: boolean) => void;
  preferredAction: string;
  setPreferredAction: (screen: string) => void;
  URLPath: string;
  setURLPath: (url: string) => void;
  newCompanyURL: string;
  setNewCompanyURL: (url: string) => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
  formDirty: false,
  setFormDirty: (fact: boolean) => set({ formDirty: fact }),
  preferredAction: "login",
  setPreferredAction: (screen: string) => set({ preferredAction: screen }),
  URLPath: "/super/dashboard",
  setURLPath: (url: string) => set({ URLPath: url }),
  newCompanyURL: "",
  setNewCompanyURL: (url: string) => set({ newCompanyURL: url }),
}));
