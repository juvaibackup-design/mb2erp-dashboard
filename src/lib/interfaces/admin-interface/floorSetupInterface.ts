import { Branch, StockPointInitialValues } from "./stockPointInterface";

export interface Floor {
  floor_id: number;
  floor_name: string;
  initial_id?: string;
  stockpoint_id: number | string;
  total_area: number | undefined;
  sales_area: number | undefined;
  is_active: boolean;
  sales_forecast: boolean;
  replenishment: boolean;
  created_by?: string;
  created_date?: string;
  modified_by?: string | null;
  modified_date?: string;
  rent: number | undefined;
  branch_id?: number | string | string[];
  stockpoint_name?: string | null;
  enable_rent?: boolean;
}

export interface FloorData {
  _branch: Branch[];
  _stocPoint: StockPointInitialValues[];
  _floor: Floor[];
}
