export interface cardTypeInfo {
  id: number;
  card_name: string;
  bank_commision: number | null | string;
  bank_ledger_id: number | null;
  bank_commision_ledger_id: number | null;
  company_id: number;
  branch_id: number | null;
  is_active: boolean;
  denomination: boolean;
}

export interface branchDetail {
  branch_id: number;
  branch_name: string;
}

export interface bankCommissionLedger {
  f_id: number;
  f_group_name: string;
  f_group_id: number;
  f_group_under: number;
}

export interface bankLedger {
  f_id: number;
  f_group_name: string;
  f_group_id: number;
  f_group_under: number;
}

export interface CardTypeInitialData {
  cardTypeInitialData: {
    cardTypeInfo: cardTypeInfo[];
    branchDetail: branchDetail[];
    bankCommissionLedger: bankCommissionLedger[];
    bankLedger: bankLedger[];
  };
}

export interface ResponseData {
  cardTypeInitialData: CardTypeInitialData;
  userid: number | null;
  status: string;
  code: number;
  errordescription: string | null;
}
