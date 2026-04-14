export interface DeliveryChallanTableData {
  type?: string;
  type2?: string;
  seqNo: number;
  id: number;
  srId?: number;
  dcNo: string;
  dcDate: string;
  customerName: string;
  stockPointName: string;
  againstInvoiceNo?: string;
  againstNo?: string;
  createdBy: string;
  qty: number;
  netAmount: number;
  status?: string;
  isAgainst?: boolean;
}
