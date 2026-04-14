export interface Term {
  id: number;
  term_code: string;
  term_name: string;
  is_active: boolean;
  seq: number;
  charge_code: string;
  charge_name: string;
  rate: number;
  sign: string;
  formula: string;
  time_stamp: string;
  header_line: string;
  type: string;
  flow_from_itemtax: boolean;
  is_taxable: boolean;
  is_changable: boolean;
  approval_status?: number;
  is_default: boolean;
}

export interface Charge {
  charge_code: number;
  charge_name: string;
  sign: string;
  type: string;
  header_line: string;
  call_on: string;
  factor: number;
  charge_code1: string;
  time_stamp: string;
  ledger_id: number;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
  company_id: number;
  branch_id: number;
  is_active: boolean;
  is_changeable: boolean;
  is_auto_round: boolean;
  status_flag?: number;
}

export interface ChargeWithFormula {
  charge_code: number;
  charge_name: string;
  sign: string;
  type: string;
  header_line: string;
  call_on: string;
  factor: number;
  charge_code1: string;
  time_stamp: string;
  ledger_id: number;
  created_by: string;
  created_date: string;
  modified_by: string | null;
  modified_date: string;
  company_id: number;
  branch_id: number;
  is_active: boolean;
  is_changable: boolean;
  is_taxable: boolean;
  is_auto_round: boolean;
  flow_from_item_tax: boolean | null;
  seq: string;
  formula: string;
}

export interface TermCharge {
  id: number;
  term_code: string;
  term_name: string;
  is_active: string | boolean;
  seq: number;
  charge_code: string;
  charge_code1: string;
  charge_name: string;
  rate: number;
  sign: string;
  formula: string;
  time_Stamp: string;
  header_line: string;
  type: string;
  flow_From_ItemTax: boolean;
  is_Taxable: boolean;
  is_changeable: boolean;
  status_flag: number;
  is_default: boolean;
}

export interface TermChargeResponse {
  id: number;
  term_code: string;
  term_name: string;
  is_active: string | boolean;
  seq: number;
  charge_code1: string;
  charge_name: string;
  rate: number;
  sign: string;
  formula: string;
  time_Stamp: string;
  header_line: string;
  type: string;
  is_changeable: boolean;

  //* removable keys
  checked?: boolean;
  formulaTracker?: any[] | null;
  // is_Taxable: boolean;
}

export interface GetTermsAndChargesResponse {
  termCode: string;
  isDefault: boolean;
  termsCharges: {
    "product level": TermCharge[];
    "invoice level": TermCharge[];
  };
  charges: Charge[];
}

export interface GetTermsCharge {
  termCode: string;
  isActive: boolean;
  termsCharges: TermCharge[];
  charges: Charge[];
}

export interface Options {
  label: string;
  value: string;
  disabled?: boolean;
  status_flag?: number;
}

export interface ChargeOptions {
  productLevel: Options[];
  invoiceLevel: Options[];
}
