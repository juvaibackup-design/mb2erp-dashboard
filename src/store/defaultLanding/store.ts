import { create } from "zustand";

type DashboardNavState = {
  targetDashboardId: string | null;
  setTargetDashboardId: (id: string | null) => void;
  // convenience method to read & clear once
  consumeTargetDashboardId: () => string | null;
};

export const useDashboardNavStore = create<DashboardNavState>((set, get) => ({
  targetDashboardId: null,
  setTargetDashboardId: (id) => set({ targetDashboardId: id }),
  consumeTargetDashboardId: () => {
    const id = get().targetDashboardId;
    set({ targetDashboardId: null });
    return id;
  },
}));
