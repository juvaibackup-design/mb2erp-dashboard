// Ledger List Screen Items
export interface LedgerListItem {
  glId: number;
  glName: string;
  alias: string;
  printName: string;
  groupId: number;
  mobile1: string;
  email: string;
  isActive: boolean;
  branchId: number;
  companyId: number;

  // NEW FIELDS for list screen display:
  currencyId?: number;
  currencyName?: string;
  currencySymbol?: string;
  status?: number;
  statusLabel?: string;
  openingBalance?: number;
  balanceType?: "debit" | "credit";
  description?: string;

  // You might also want these for filtering/sorting:
  crLimit?: number;
  crDays?: number;
  billWise?: boolean;
  crAndDr?: boolean;
  id?: number;
  approvalStatus?: any;
}

// Ledger Role List
export interface LedgerRole {
  roleId: string;
  roleName: string;
}

// Ledger Group List
export interface LedgerGroup {
  groupId: number;
  groupName: string;
  id: number;
  nature: string;
}

// Ledger Bank Details
export interface LedgerBank {
  id: number;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  sourceCode: string;
}

// Ledger Payment Terms
export interface LedgerPayment {
  id: number;
  termName: string;
}

export interface Country {
  r_cyc_id: number;
  r_country: string;
}

export interface Site {
  id: number;
  branch_name: string;
}

// NEW: Currency Interface
export interface Currency {
  setup_id: number;
  currency_id: string;
  currency_name: string;
  currency_symbol: string;
  default_currency: number;
}

// NEW: Status Dropdown Interface
export interface StatusDropdownItem {
  label: string;
  id: number; // 1 = Active, 2 = Inactive
}

// Updated LedgerData interface
export interface LedgerData {
  ledgerListScreen: LedgerListItem[];
  ledgerRole: LedgerRole[];
  ledgerGroup: LedgerGroup[];
  ledgerBank: LedgerBank[];
  ledgerPayment: LedgerPayment[];
  country: Country[];
  siteOptions: Site[];

  // NEW: Add currency and status dropdowns
  currencyOptions: Currency[];
  statusDropdown: StatusDropdownItem[];
}

// Updated LedgerApiResponse interface
export interface LedgerApiResponse {
  data: {
    ledgerListScreen: LedgerListItem[];
    ledgerRole: LedgerRole[];
    ledgerGroup: LedgerGroup[];
    ledgerBank: LedgerBank[];
    ledgerPayment: LedgerPayment[];
    country: Country[];
    siteOptions: Site[];

    // NEW: Add currency and status dropdowns
    currencyOptions: Currency[];
    statusDropdown: StatusDropdownItem[];
  };
  userid?: number | null;
  status?: string;
  code?: number;
  errordescription?: string | null;
  errors?: any;
  error?: any;
}

export interface PaymentVoucher {
  id: number;
  voucherNo: string;
  voucherDate: string; // ISO date string
  accountBy: string;
  accountTo: string;
  amount: number;
  naration: string;
  refType: string;
  refNo: string;
  refDate: string; // ISO date string
  type: "Adjusted" | string;
  year: string;
  select: boolean;
}
export interface ReceiptVoucher {
  id: number;
  voucherNo: string;
  voucherDate: string; // ISO date string
  accountBy: string;
  accountTo: string;
  amount: number;
  naration: string;
  refType: string;
  refNo: string;
  refDate: string; // ISO date string
  type: "Adjusted" | string;
  year: string;
  select: boolean;
}
export interface site {
  id: number;
  branch_name: string;
}
export interface AccountBy {
  id: number;
  under: string;
  name: string;
  alias: string;
  crLimit: number;
  type: string;
  balance: number;
  isSledger?: boolean; // optional (present only in accountTo)
}
export interface AccountTo {
  id: number ;
  under: string;
  name: string;
  alias: string;
  crLimit: number;
  type: string;
  balance: number;
  isSledger?: boolean; // optional (present only in accountTo)
}
export interface ReferenceType {
  id: number;

  type: string;
}
export interface voucherType {
  voucherTypeId: number;
  voucherTypeName: string;
  typeOfVoucher: string;
}
