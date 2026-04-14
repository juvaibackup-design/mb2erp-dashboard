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
  status_flag: number;
  status: string;
  approval_status: number;
  currency_setup: number | string | null;
  currencyDetails?: Currency[];
}

export interface Ledger {
  ledger_id: number;
  ledger_name: string;
}

export interface TaxGroup {
  tax_group_name: string;
  taxname: string;
  input_percent: number | null;
}

export interface Currency {
  currency_name: string;
  currency_setup: string | number;
}
