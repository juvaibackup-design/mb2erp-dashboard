export interface PromotionData {
  promotionId: number;
  promotionName: string;
  promotionNo: string;
  validFrom: string; // Assuming ISO date format
  validTo: string; // Assuming ISO date format
  timeFrom: string; // Assuming time in string format (HH:mm:ss)
  timeTo: string; // Assuming time in string format (HH:mm:ss)
  location: string;
  status: "Active" | "Pending Approval" | "Expired"; // Assuming status can only be ACTIVE or INACTIVE
  extinct: boolean;
}
export interface Assortment {
  assortmentId: number;
  assortmentNo: string;
  assortmentName: string;
}

export interface Promotion {
  promotions: PromotionData[];
  assortments: Assortment[];
}
