export interface BasedOn {
  id: string;
  type_name: string;
}

export interface InvoiceType {
  id: number;
  type_Name: string;
}

export interface InvoiceDNType {
  id: number;
  typeName: string;
}

export interface Location {
  id: number;
  branch_name: string;
  initial: string;
}
export interface invoiceAccountLedgers {
  lg_id: number;
  gl_name: string;
  g_name: string;
}

export interface StockPoint {
  id: number;
  stkpt_code: number;
  stkpt_name: string;
  stkpt_type: string;
  branch_id: number;
  is_active: string;
  is_default: boolean;
  sales_forecast: boolean;
  replenishment: boolean;
  created_by: string;
  modified_by: string;
  modified_date: string;
  rent: number;
}

export interface Transporter {
  ent_id: number;
  party_id: string;
  party_code: string;
  party_name: string;
  city: string;
  status_flag: null | number;
}

export interface Agent {
  ent_id: number;
  party_id: string;
  party_code: string;
  party_name: string;
  city: string;
  status_flag: null | number;
}

export interface Employee {
  code: string;
  id: string;
  name: string;
}
export interface Merchant {
  code: string;
  id: string;
  name: string;
}

export interface OrderMode {
  f_order_Mode: string;
}

export interface DeliveryChallanOrderMode {
  value: string;
}

export interface paymentTerm {
  id: number;
  name: string;
}

export interface Currency {
  setup_id: number;
  currency_id: string;
  currency_name: string;
  default_currency: number;
}

export interface Vendor {
  ent_id: number;
  party_id: string;
  party_code: string;
  party_name: string;
  agent_name: string;
  transporter_name: string;
  agent_rate: number;
  validate_logistic: boolean;
  validate_payment: boolean;
  city: string;
  state_id: number;
  consignment_location_id: string;
  default_term_code: string;
  billing_for: string;
  credit_limit: number;
  credit_days: number;
  discount: number;
  gst: any;
  payment_term_id?: null | string | number;
  payment_term?: null | string;
  effect_on?: null | string;
  status_flag: number;
  shipping_addresses: any[];
}
interface AgainstDNItem {
  id: number;
  againstNo: string;
  againstType: string;
  vendorName: string | null;
  docNo: string | null;
  docDate: string;
  stockPointId: string;
  transporterName: string;
  buyerName: string;
  agentName: string;
  agentCommission: number;
  paymentTerm: string | null;
  orderMode: string;
}

interface AgainstReq {
  entryId: number;
  entryNo: string;
  entryDate: string;
  salesmanId: number;
  barcode: string;
  productName: string;
  qty: number;
  salesPrice: number;
  salesValue: number;
  discount: number;
  discountedSales: number;
  productDiscountName: string;
  productDiscountValue: number;
  productDiscountFactor: number;
  invoiceDiscountName: string;
  invoiceDiscountValue: number;
  invoiceDiscountFactor: number;
  icode: string;
  oemCode: string;
  grpCode: number;
  uomId: number;
  stockpointId: number;
  taxCode: number;
  promoId: string;
  promoDiscountValue: number;
  invoiceEntryId: number;
  taxValue: number;
  productPoints: number;
  adjustedQty: number;
  companyId: number;
  branchId: number;
  isUpdated: boolean;
  scanUnitQty: null | number;
  makeOrderFlag: boolean;
}

interface RequestBasedOnDropdown {
  id: number;
  value: string;
}

export interface InitialDataResponse {
  lrInDetails: any[];
  basedOn: BasedOn[] | null;
  invoiceType: InvoiceType[];
  type: InvoiceDNType[];
  typeDropdown: InvoiceDNType[];
  locations: Location[];
  branchList: Location[];
  transpoter: Transporter[];
  agent: Agent[];
  employee: Employee[];
  orderMode: OrderMode[] | DeliveryChallanOrderMode[];
  currency: Currency[];
  stockPoint: StockPoint[];
  stockpoint: StockPoint[];
  merchant: Merchant[];
  vendor: Vendor[];
  paymentTerm: paymentTerm[];
  againstGrt: AgainstDNItem[];
  againstPi: AgainstDNItem[];
  againstStf: AgainstDNItem[];
  against: AgainstReq[];
  requestbasedOnDropdown: RequestBasedOnDropdown[];
  invoiceAccountLedgers:invoiceAccountLedgers[]
}

// Main data interface
export interface MainInitialData {
  data: InitialDataResponse;
  userid: null | string;
  status: string;
  code: number;
  errordescription: null | string;
}
