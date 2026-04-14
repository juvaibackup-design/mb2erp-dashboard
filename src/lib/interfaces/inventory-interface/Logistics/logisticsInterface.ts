export type UOM = {
  r_uom_id: number;
  r_uom_name: string;
  r_is_active: boolean;
  r_created_by: string;
  r_created_date: string;
  r_modified_by: null;
  r_modified_date: string;
  r_individual: boolean;
  r_status: boolean;
  r_display_name: string;
  r_company_id: number;
  r_branch_id: number;
};

export type Transporter = {
  r_party_name: string;
  r_party_code: string;
  r_city: string;
};

export type CityInfo = {
  r_cid: number;
  r_city: string;
  r_district: string;
  r_state: string;
  r_country: string;
};

export type ProductInfo = {
  r_product: string;
  r_p_index: number;
};

export type EmpForVerifyHandover = {
  r_employee_id: string;
  r_salesman_code: string;
  r_emp_name: string;
};

export type Courier = {
  r_courier_id: number;
  r_courier_no: string;
  r_courier_date: string;
};

export type Policy = {
  r_policy: string;
};

export type LrInList = {
  track_no: string;
  track_date: string;
  type: string;
  supplier: string;
  transporter: string;
  lr_no: string;
  lr_date: string;
  id: number;
  qty: number;
  unit: string;
  amount: number;
  freight: number;
};

export interface LRInwardTypes {
  uom: UOM[];
  transporter: Transporter[];
  cityInfo: CityInfo[];
  productinfo: ProductInfo[];
  empforVerifyHandover: EmpForVerifyHandover[];
  courier: Courier[];
  policy: Policy[];
  lrInList: LrInList[];
}

export interface LROutwardTypes {
  uom: UOM[];
  transporter: Transporter[];
  cityInfo: CityInfo[];
  policy: Policy[];
  lrOutList: LrInList[];
}

export interface GateEntryTypes {
  gate_entry_mas_id: number;
  entry_no: string;
  entry_date: string;
  lr_type: string;
  ward_type: string;
  sup_cut_code: string;
  received_by: string;
  sup_cut_name: string;
}
