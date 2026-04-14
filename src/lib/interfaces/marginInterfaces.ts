export interface autoRule {
  id: number;
  rule_name: string;
  // margin_code: string;
  margin_type: string; //type_name
  calc_from: string;
  calc_method: string;
  wsp_type: string | null;
  wsp_formula: string | null;
  wsp_value1: number | null;
  wsp_value2: number | null;
  wsp_select: boolean;
  rsp_type: string | null;
  rsp_formula: string | null;
  rsp_value1: number | null;
  rsp_value2: number | null;
  rsp_select: boolean;
  listed_mrp_type: string | null;
  listed_mrp_formula: string | null;
  listed_mrp_value1: number | null;
  listed_mrp_value2: number | null;
  listed_mrp_select: boolean | null;
  online_mrp_type: string | null;
  online_mrp_formula: string | null;
  online_mrp_value1: number | null;
  online_mrp_value2: number | null;
  online_mrp_select: boolean;
  created_by: string | null;
  modify_by: string | null;
  is_active: boolean;
  branch_id: number;
  company_id: number;
}

export interface type {
  type_name: string;
}

export interface marginCalculation {
  calculation_name: string;
}

export interface factures {
  facture: string;
}

export interface marginFormulas {
  farmula: string;
}

export interface margineRuleGrids {
  is_select: boolean;
  price: string;
  type: string;
  formula: string;
  value1: number;
  value2: number;
}

export interface ApiResponse {
  data: {
    autoRule: autoRule[];
    type: type[];
    marginCalculation: marginCalculation[];
    factures: factures[];
    marginFormulas: marginFormulas[];
    margineRuleGrids: margineRuleGrids[];
  };
  userid: null;
  status: string;
  code: number;
  errordescription: null;
}
