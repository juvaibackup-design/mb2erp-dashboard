export interface Branch {
  id: number;
  branch_name: string;
}

export interface StockPointType {
  _StockpointName: string;
}

export interface StockPointInitialValues {
  id?: string;
  stockpoint_name: string;
  stockpoint_id?: number;
  branch_id?: number | string | string[];
  company_id?: number;
  stockpoint_type: string;
  is_active: boolean;
  bydefault: boolean;
  sales_forecast: boolean;
  replenishment: boolean;
  enable_rent?: boolean;
  created_by?: string;
  time_stamp?: string;
  modified_by?: string;
  modified_date?: string;
  rent: number | string | undefined | null;
}

export interface Option {
  _StockpointName: string;
}

export interface StockPointData {
  _Branch: Branch[];
  _StocPointType: StockPointType[];
  _StockPoint: StockPointInitialValues[];
}
