export interface BalanceSheetLedger {
  uid: string;
  ledgerid: number;
  name: string | null;
  under: number;
  isgroup: boolean;
}
export interface SiteOption {
  id: number;
  branch_name: string;
  is_ho:boolean;
}
export interface DropdownOption {
  label: string;
  id: number;
}
export interface BalanceSheetData {
  balanceSheetLedgerList: BalanceSheetLedger[];
  siteOptions: SiteOption[];
  statusDropdown: DropdownOption[];
  viewByDropdown: DropdownOption[];
}
