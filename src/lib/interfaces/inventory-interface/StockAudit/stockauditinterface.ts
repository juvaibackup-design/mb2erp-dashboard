export interface PlanData {
  plan_code: string;
  plan_name: string;
  created_on: string;
  stockpoint_id: number;
  stockpoint_name: string | number;
  audit_on: string;
  description: string;
  status: string;
  division: string;
  section: string;
  department: string;
  supplier: string;
  category1: string | null;
  category2: string | null;
  category3: string | null;
  category4: string | null;
  category5: string | null;
  category6: string | null;
  planwise_code: number;
  timestamp: string;
  id: number;
  company_id: number;
  branch_id: number;
  is_updated: boolean | null;
  is_active: boolean;
  category7: string | null;
  category8: string | null;
  category9: string | null;
  category10: string | null;
  category11: string | null;
  category12: string | null;
  category13: string | null;
  category14: string | null;
  category15: string | null;
  category16: string | null;
  employee: string | null;
  restrict_permission: string | null;
  saveinfo_json: string | null;
  is_edit: boolean;
}
export interface TeamMember {
  id: number;
  employee_id: string;
  salesman_code: string;
  first_name: string;
}

export interface Site {
  id: number;
  branch_name: string;
  is_active: boolean;
}

export interface StockPoint {
  stockpoint_name: string;
  stockpoint_id: number;
  branch_id: number;
  company_id: number;
  is_active: boolean;
}

export interface DropdownItem {
  type: string;
}
export interface AuditPlan {
  plan_id: number;
  plan_code: string;
  plan_name: string;
  stockpoint_id: number;
  site: number[];
}

export interface AuditAdminPlan {
  plan_id: number;
  plan_code: string;
  plan_name: string;
  stockpoint_id: number;
  site: number[];
}
export interface AuditPackage {
  id: number;
  package_no: string;
  plan_code: string;
}

export interface StockAuditItem {
  availableQty: number;
  isUniqueBarcode: boolean;
  seq_no: number;
  item_id: number;
  barcode: string;
  products: string;
  item_name: string;
  description: string;
  grp_code: number;
  stock_qty: number;
  rate: number;
  discount: number;
  tax: number;
  std_rate: number;
  amount: number;
  quantity: number;
  wsp: number;
  rsp: number;
  mrp: number;
  oem_code: string;
  icode: string;
}
export interface ProductData {
  plan_name: string;
  package_no: string;
  barcode: string;
  plan_code: string;
  icode: string;
  grp_code: number;
  system_stock: number;
  rate: number;
  mrp: number;
  physical_qty: number;
  inventory_qty: number;
  stock_qty: number;
  division: string;
  section: string;
  department: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
  category5: string;
  category6: string;
  category7: string;
  category8: string;
  category9: string;
  category10: string;
  category11: string;
  category12: string;
  category13: string;
  category14: string;
  category15: string;
  category16: string;
  stockpoint_name: string;
  grn_qty: number;
  grn_no: string | number;
  amount: number;
  item_name: string;
  description: string;
  team: string[];
  site: string;
  plan_id: any;
}
export interface PlanDetail {
  plan_name: string;

  stockpoint: string;
  team: string;
  site: string;
  plan_code: string;
  audit_on: string;
  restrict_permission: boolean;
  division: string;
  section: string | null;
  plan_id: any;
  department: string | null;
  category1: string | null;
  category2: string | null;
  category3: string | null;
  category4: string | null;
  category5: string | null;
  category6: string | null;
  category7: string | null;
  category8: string | null;
  category9: string | null;
  category10: string | null;
  category11: string | null;
  category12: string | null;
  category13: string | null;
  category14: string | null;
  category15: string | null;
  category16: string | null;
}
export interface userRights {
  allow_user_to_verify: boolean;
  allow_user_to_activate: boolean;
  allow_user_to_complete: boolean;
}

export interface ApiResponse {
  data: {
    PlanData: PlanData[];
    TeamMember: TeamMember[];
    Site: Site[];
    StockPoint: StockPoint[];
    DropdownItem: DropdownItem[];
    plan_list: AuditPlan[];
    package_no_list: AuditPackage[];
    StockAuditItem: StockAuditItem[];
    ProductData: ProductData[];
    plan_admin: AuditAdminPlan[];
    planDetails: PlanDetail[];
    userRights: userRights[];
  };

  status: string;
  errorCode: number;
}
