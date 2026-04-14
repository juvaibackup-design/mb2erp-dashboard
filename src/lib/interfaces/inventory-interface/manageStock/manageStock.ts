import { ReactNode } from "react";
// import { RenderedCell } from "";
export type rateChangeType = {
  branchId: number;
  companyId: number;
  createdBy: string;
  entryDate: string;
  entryId: number;
  entryNo: string;
  remarks: string;
  stockpointId: number;
};
export type miscStockType = {
  createdBy: string;
  entryDate: string;
  entryId: number;
  entryNo: string;
  entryType: string;
  isActive: boolean;
  remarks: string;
  stockpointId: number;
};
export interface tableColumnType {
  title: string | ReactNode;
  key: string;
  dataIndex: string;
  align?: "left" | "right" | "center" | undefined;
  className: string;
  filterSearch: boolean;
  fixed: boolean;
  id: number;
  width?: string;
  accessProperty?: string;
  label?: string;
  value?: string;
  isVisible?: boolean;
  body?: string;
  render?: ((value: any, record: any, index: number) => any) | undefined;
}
