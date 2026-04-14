import makeApiCall from "@/lib/helpers/apiHandlers/api";
import {
  getBranchIdByHeader,
  getCompanyDetails,
} from "@/lib/helpers/getCookiesClient";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const branchId = getCompanyDetails("id");
const companyId = getBranchIdByHeader("companyId");

const usePromotionStore = create(
  devtools(
    (set: (arg0: (state: any) => { promotion: any[] }) => void, get: any) => ({
      promotion: null,
      promotionSave: async (data: any) => {
        const response = await makeApiCall.post(`PromotionSave`, data);
        if (response?.data?.code === 200) {
          return response?.data?.code;
        }
      },
      initPromotion: async (search: any = null) => {
        const response = await makeApiCall.get(
          `GetPromotionInitialData?branchId=${branchId}&minId=0&noOfData=20&searchtext=${search}`
        );
        if (response?.data?.code === 200) {
          set((state) => ({
            promotion: response?.data?.data,
          }));
        }
      },
    })
  )
);

export default usePromotionStore;
