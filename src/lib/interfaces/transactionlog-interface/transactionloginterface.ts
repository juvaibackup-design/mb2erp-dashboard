// ================================
// TransactionLog.interface.ts
// ================================

export interface ITransactionLogItem {
  id: number;
  saleId: number;
  type: string;
  customer: string | null;
  amount: number;
  date: string;
  location: string;
  status: string;
  d365SalesId: string | null;
  d365InvoiceNo: string | null;
  errorMessage: string | null;
}

export interface ITransactionDashboard {
  total: number;
  posted: number;
  failed: number;
  pending: number;
  blocked: number;
}

export interface ITransactionLogResponse {
  data: ITransactionLogItem[];
  dashbord: ITransactionDashboard;
  total: number;
  page: number;
  pageSize: number;
}