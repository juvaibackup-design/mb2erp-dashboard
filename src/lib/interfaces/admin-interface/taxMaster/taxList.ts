import {
  PurchaseSlabInterface,
  SalesSlabInterface,
} from "@/app/_components/taxMasterComponents/taxform/constants";

export interface TaxMaster {
  tax_code: number;
  tax_group_id: number;
  tax_name: string;
  effect_from: string;
  is_active: boolean;
  input_tax_name: string;
  output_tax_name: string;
  form: string;
  input_percent: number;
  output_percent: number;
  total_input_percent: number;
  total_output_percent: number;
  time_stamp: any;
  selection: any;
  created_by: any;
  created_date: string;
  display_name: string;
  is_input_slab: boolean;
  is_output_slab: boolean;
  input_print_name: string;
  output_print_name: string;
  pledger_id: number;
  purchase_account_ledger_id: number;
  preturn_ledger_id: number;
  purchase_return_account_ledger_id: number;
  sledger_id: number;
  sales_account_ledger_id: number;
  sreturn_ledger_id: number;
  sales_return_account_ledger_id: number;
  wholesales_ledger_id: number;
  wholesales_account_ledger_id: number;
  wholesales_return_ledger_id: number;
  wholesales_return_account_ledger_id: number;
  inventory_ledger_id: number;
  inventory_account_ledger_id: number;
  inventory_return_ledger_id: number;
  inventory_return_account_ledger_id: number;
  branch_id: number;
  company_id: number;
  purchaseSlab: PurchaseSlabInterface[] | [];
  salesSlab: SalesSlabInterface[] | [];
}

export interface GetPurchaseTaxLedgerList {
  id: number;
  group: string;
  name: string;
  alias: string;
}

export interface TaxList {
  taxMaster: TaxMaster[];
  taxGroup: any[];
  getPurchaseTaxLedgerList: GetPurchaseTaxLedgerList[];
}
