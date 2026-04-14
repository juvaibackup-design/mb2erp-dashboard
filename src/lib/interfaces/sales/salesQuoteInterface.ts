export interface SalesQuoteTabledata {
  id: number;
  sqNo: string;
  sqDate: string;
  customer: string;
  stockPointId: number;
  stockPointName: string;
  createdBy: string;
  quantity: number;
  amount: number;
  statusFlag: number;
  status: string;
}

export interface Type {
  id: number;
  typeName: string;
}

export interface AgainstSo {
  id: number;
  againstNo: string;
  againstType: string;
  customerCode: string;
  docNo: string | null;
  docDate: string; // Use Date type if you want to handle date objects
  stockPointId: string;
  transporterName: string;
  salesmanName: string | null;
  buyerName: string;
  agentName: string | null;
  agentCommission: number;
  paymentTerm: string | null;
  orderMode: string;
}

export interface Customer {
  id: number;
  customerCode: string;
  customerName: string;
  transporterName: string;
  agentName: string;
  rateCommission: number;
  paymentTerm: string;
}

export interface Locations {
  id: number;
  branchName: string;
  initial: string;
}

export interface Transporter {
  entId: number;
  partyId: string;
  partyCode: string;
  partyName: string;
  city: string;
}

export interface Employee {
  code: string;
  id: string;
  name: string;
}

export interface OrderMode {
  value: string;
}

export interface Currency {
  setupId: number;
  currencyId: string;
  currencyName: string;
  defaultCurrency: number;
}

export interface StockPoint {
  id: number;
  stockPointId: number;
  stockPointName: string;
  stockPointType: string;
  branchId: number;
  isActive: string;
  isDefault: boolean;
  salesForecast: boolean;
  replenishment: boolean;
  createdBy: string;
  modifiedBy: string | null;
  modifiedDate: string; // Use Date type if you want to handle date objects
  rent: number;
}

export interface Vendor {
  entId: number;
  partyId: string;
  partyCode: string;
  partyName: string;
  agentName: string;
  transporterName: string;
  agentRate: number;
  validateLogistic: boolean;
  validatePayment: boolean;
  city: string;
  stateId: number;
  consignmentLocationId: string;
  defaulTermCode: string;
  billingFor: string;
  creditLimit: number;
  creditDays: number;
  discount: number;
  gst: string | null;
  paymentTermId: string | null;
  paymentTerm: string | null;
  effectOn: string | null;
}

export interface PaymentTerm {
  id: number;
  name: string;
}

export interface AccountLedger {
  id: number;
  name: string;

}

export interface SalesMan {
  id: number;
  salesmanCode: string;
  salesmanName: string;
}

export interface ShippingAddress {
  id: number;
  customerCode: string;
  name: string;
  address: string;
}


export interface DropdownData {
  basedOn: null;
  type: Type[];
  againstSo: AgainstSo[];
  againstSq: AgainstSo[];
  againstDc: AgainstSo[];
  againstStf: AgainstSo[];
  customer: Customer[];
  locations: Locations[];
  transporter: Transporter[];
  agent: Transporter[];
  employee: Employee[];
  orderMode: OrderMode[];
  currency: Currency[];
  stockPoint: StockPoint[];
  vendor: Vendor[];
  paymentTerm: PaymentTerm[];
  salesMan: SalesMan[];
  accountManager: null;
  shippingAddress: ShippingAddress[];
}
