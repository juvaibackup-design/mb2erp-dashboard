import { InitialDataResponse } from "../initialDataInterfaces";
import { GetTermsAndChargesResponse } from "./termsInterfaces";

export interface SummaryItem {
  out_of_seq_no: number;
  seq_no: number;
  invoice_no: string;
  type: number | any;
  invoice_date: string;
  based_on: number;
  billing_for: string;
  supplier_id: string;
  doc_no: string;
  doc_date: string | null;
  valid_from: string | null;
  valid_till: string | null;
  stock_point: number;
  against_id: number;
  logistic_id: number;
  allow_logistic: boolean;
  transport_name: string;
  agent_id: string;
  remarks: string;
  round_off: number;
  id: number;
  purchase_account_id: number;
  payment_term: number;
  order_mode: string;
  req_location_code: number;
  employee_id: string;
  agent_commission: number;
  currency_id: number;
  basic_amount: number;
  net_amount: number;
  custom_field1: string;
  custom_field2: string;
  custom_field3: string;
  custom_field4: string;
  custom_field5: string;
  cf_date1: string;
  cf_date2: string;
  cf_combo1: string;
  cf_combo2: string;
  cf_radio1: boolean;
  cf_radio2: boolean;
  status_flag: number;
  status: string;
  credit_days: number;
  agent_name: string;
  supplier_name: string;
  employee_name: string;
  stock_point_name: string;
  vendor_name: string;
  against_no: string;
  location: any;
  discount: any;
  default_com_term_code: string;
  defaultterm_code: string;
  currency_name: string;
  currency_symbol: string;
  conversion_rate: string;
  po_ratio: string;
  lrIn: number | null;
}
export interface SummaryItemPI {
  out_of_seq_no: number;
  seq_no: number;
  invoice_no: string;
  type: number | any;
  invoice_date: string;
  based_on: number;
  billing_for: string;
  supplier_id: string;
  doc_no: string;
  doc_date: string | null;
  valid_from: string | null;
  valid_till: string | null;
  stock_point: number;
  against_id: number;
  logistic_id: number;
  allow_logistic: boolean;
  transport_name: string;
  agent_id: string;
  remarks: string;
  round_off: number;
  id: number;
  purchase_account_id: number;
  payment_term: number;
  order_mode: string;
  req_location_code: number;
  employee_id: string;
  agent_commission: number;
  currency_id: number;
  basic_amount: number;
  net_amount: number;
  custom_field1: string;
  custom_field2: string;
  custom_field3: string;
  custom_field4: string;
  custom_field5: string;
  cf_date1: string;
  cf_date2: string;
  cf_combo1: string;
  cf_combo2: string;
  cf_radio1: boolean;
  cf_radio2: boolean;
  status_flag: number;
  status: string;
  credit_days: number;
  agent_name: string;
  supplier_name: string;
  employee_name: string;
  stock_point_name: string;
  vendor_id: string;
  agent: string;
  transporter: string;
  pi_no: string;
  merchant: string;
  pi_date: string;
  currency_name: string;
  currency_symbol: string;
  conversion_rate: string;
}

interface imageList {
  id: number;
  url: string;
  image: string;
}

export interface DetailsItem {
  isUniqueBarcode: any;
  invoiceInvDetailId: number;
  invoiceLotDetailId: number;
  itemMasterId: number;
  seqNo: number;
  itemID: number;
  itemId: number;
  barCode: string;
  description: string;
  groupName: string | null;
  quantity: any;
  wsp: number;
  mrp: number;
  rsp: any;
  listedMrp: number;
  rate: number;
  discount: number;
  stdRate: number;
  amount: number;
  outputTax: number;
  taxAmount: number;
  charges: number;
  effRate: number;
  taxCode: number;
  taxName: string;
  inputPercent: number;
  oemCode: string;
  oemcode: string;
  iCode: string;
  icode: string;
  grpCode: number;
  orderQty: number;
  pendingQty: number;
  focQty: number;
  onlineMrp: number;
  splDiscount: number;
  setCode: string;
  itemCode: string;
  hsnCode: string | null;
  itemImage: string | null;
  itemName: string;
  cat1: string;
  cat2: string;
  cat3: string;
  cat4: string;
  cat5: string;
  cat6: string;
  cat7: string;
  cat8: string;
  cat9: string;
  cat10: string;
  cat11: string;
  cat12: string;
  cat13: string;
  cat14: string;
  cat15: string;
  cat16: string;
  availableQty: number;
  againstDetId: number;
  againstInvoiceId: number;
  againstInvoiceNo: string;
  againstInvoiceDate: string;
  psDetailId: number;
  psNo: string;
  psDate: string | null;
  uomid: number;
  receivedQty: number | any;
  image: imageList[];
  exchangeRate: any;
  exchangeStdRate: any;
  exchangeEffRate: any;
  exchangeDiscount: any;
  supplierCode?: any;
}

export interface ChargesItem {
  chargename: string;
  sign: string;
  type: string;
  amount: string;
  basic: string;
  net: string;
  colhead: string;
  calon: string;
  r_amount: string;
  termcode: string;
  chargecode: string;
  taxcode: string;
}

export interface PoReceiveRatioItem {
  // Define the properties for poReceiveRatio here
}

export type MainSelectedInvoiceProps = {
  summary: SummaryItem[];
  details: DetailsItem[];
  charges?: ChargesItem[];
  poReceiveRatio?: PoReceiveRatioItem[];
};

export type ValidateBarcode = {
  barcode: string;
  description: string;
  icode: string;
};

export interface OrderTransactionProps {
  initialData: InitialDataResponse;
  itemMasterData: any;
  // termsAndChargesData: GetTermsAndChargesResponse;
  productListData: any;
}
