export interface PriceRange {
  mrp_differential_based_on: string;
  id: number;
  name: string;
  range_from: number | null;
  range_to: number | null;
  is_active: boolean;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
  company_id: number;
  branch_id: number;
  mrp_differential: any;
}

export interface ApiResponse {
  data: {
    priceRange: PriceRange[];
  };
  userid: null;
  status: string;
  code: number;
  errordescription: null;
}
