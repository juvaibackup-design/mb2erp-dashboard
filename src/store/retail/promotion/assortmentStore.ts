import makeApiCall from "@/lib/helpers/apiHandlers/api";
import {
  getBranchIdByHeader,
  getCompanyDetails,
} from "@/lib/helpers/getCookiesClient";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const branchId = getCompanyDetails("id");
const companyId = getBranchIdByHeader("companyId");

type AssortmentStore = {
  assortments: any[];
  addAssortment: (assortment: any) => Promise<any>;
  updateAssortment: (
    id: number,
    assortmentUpdate: Partial<any>
  ) => Promise<any>;
  deleteAssortment: (id: string) => Promise<any>;
  fetchAssortments: () => Promise<any>;
};

const useAssortmentStore = create(
  devtools(
    (
      set: (arg0: (state: any) => { assortments: any[] }) => void,
      get: any
    ) => ({
      assortments: [],
      addAssortment: async (assortment: any) => {
        const response = await makeApiCall.post(
          `createPromotionAssortment`,
          assortment
        );
        if (response?.data?.code === 200) {
          set((state: any) => ({
            assortments: [...state.assortments, { ...response?.data?.data }],
          }));
          return response?.data?.code;
        }
      },
      updateAssortment: async (id: number, assortmentUpdate: any) => {
        const response = await makeApiCall.put(
          `updatePromotionAssortment/${id}`,
          assortmentUpdate
        );
        const assortments = get().assortments;
        if (response?.data?.code === 200) {
          const assortmentPromotion = assortments?.map((assortment: any) => {
            if (assortment.id === id) {
              return {
                ...response?.data?.data,
              };
            } else {
              return assortment;
            }
          });
          set((state) => ({
            assortments: assortmentPromotion,
          }));
          return response?.data?.code;
        }
      },
      deleteAssortment: async (id: number) => {
        const response = await makeApiCall.delete(
          `deletePromotionAssortment/${id}`
        );
        const assortments = get().assortments;
        if (response?.data?.code === 200) {
          const assortmentPromotion = assortments?.filter(
            (assortment: any) => assortment.assortmentNo !== id
          );
          set((state) => ({
            assortments: assortmentPromotion,
          }));
          return response?.data?.code;
        }
      },
      fetchAssortments: async () => {
        const response = await makeApiCall.get(
          `getAllPromotionAssortments?branchId=${branchId}&companyId=${companyId}`
        );
        if (response?.data?.code === 200) {
          set((state) => ({
            assortments: response?.data?.data,
          }));
        }
      },
    })
  )
);

export default useAssortmentStore;
