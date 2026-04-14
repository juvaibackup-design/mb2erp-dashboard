export interface InitialDataResponse {
  seqNo: number;
  id: number;
  invoiceNo: string;
  invoiceDate: string; // Use `Date` if you want to handle as a Date object
  docNo: string;
  docDate: string; // Use `Date` if you want to handle as a Date object
  stockpointId: number;
  stockpointName: string;
  againstNo: string | null;
  againstDate: string | null; // Use `Date | null` if handling dates
  againstInfo: string;
  createdBy: string;
  qty: number | null;
  amount: number;
  vendorName: string | null;
  status: boolean;
  isAgainst: boolean;
}

export interface MainInitialData {
  data: InitialDataResponse[];
}
