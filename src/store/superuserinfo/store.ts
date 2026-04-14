import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSuperUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (newState: any) => set({ user: newState }),
    }),
    {
      name: "superuser-storage", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
