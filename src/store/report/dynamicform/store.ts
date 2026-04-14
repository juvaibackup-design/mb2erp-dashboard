import makeApiCall from "@/lib/helpers/apiHandlers/api";
import {
  getBranchIdByHeader,
  getCompanyDetails,
} from "@/lib/helpers/getCookiesClient";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const branchId = getCompanyDetails("id");
const companyId = getBranchIdByHeader("companyId");

type ReportStore = {
  reports: any[];

  fetchReports: () => Promise<any>;
};

export const useReportStore = create(
  devtools(
    (set: (arg0: (state: any) => { reports: any[] }) => void, get: any) => ({
      assortments: [],

      fetchAssortments: async () => {
        const response = await makeApiCall.get(
          `GetReportNavigationList?branchId=${branchId}&companyId=${companyId}`
        );
        if (response?.data?.code === 200) {
          set((state) => ({
            reports: response?.data?.data,
          }));
        }
      },
    })
  )
);
