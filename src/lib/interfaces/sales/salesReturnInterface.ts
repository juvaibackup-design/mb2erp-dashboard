export interface SalesReturnTableData {
  seqNo: number;
  id: number;
  invoiceNo: string;
  invoiceDate: string;
  customerName: string;
  docNo: string;
  docDate: string;
  againstNo: string;
  againstDate: string | null;
  stockPointId: number;
  stockPointName: string;
  createdBy: string;
  netAmount: number;
  status: string;
  statusFlag: number;
}

export interface SalesReturnForm {
  type: string;
  shippingSiteId: number;
  customerCode: number;
  dcNo: string;
  dcDate: string;
  stockpointId: number;
  paymentTerm: string;
  orderMode: string;
  transportName: string;
  agentName: string;
  againstId: string;
  billingSiteId: string;
  employeeId: string;
  buyerName: string;
  salesManName: string;
}
