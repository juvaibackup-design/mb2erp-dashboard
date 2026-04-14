export interface Location {
  branch_id: number;
  branch_name: string;
}

export interface Assortment {
  assortment_id: number;
  assortment_no: string;
  assortment_name: string;
}

export interface IncentiveDetails {
  inc_det_id: number;
  assortment_no: string;
  benefit_name: string;
  margin_from: number;
  margin_to: number;
  status_code: string | null;
  closed_date: string | null;
  basis_type: string;
  factor: number;
  created_by?: string | null;
  created_date?: string | null;
  modified_by?: string | null;
  modified_date?: string | null;
  terminal_name?: string | null;
  status: boolean;
  time_stamp?: string;
  company_id?: number;
  branch_id?: number;
  inc_mas_id?: number;
}

export interface Incentive {
  inc_id?: number;
  inc_no?: string;
  inc_name: string;
  descriptions?: string | null;
  incentive_type: string;
  margin_type: string;
  valid_from: string | null;
  valid_to: string | null;
  location: number[] | string | null;
  created_by?: string | null;
  created_date?: string;
  modified_by?: string | null;
  modified_date?: string;
  terminal_name?: string | null;
  status?: string;
  is_active?: boolean;
  // assortment: string | string[] | null;
  assortment: any;
  inc_date?: string;
  location_name?: string;
  company_id?: number;
  branch_id?: number;
  incentiveDetails: IncentiveDetails[] | [];
}
