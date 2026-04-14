export interface FieldConfiguration {
  columnId: number;
  orderNo: number;
  groupName: string;
  field: string;
  caption: string;
  type: string;
  description: string;
  isRequired: boolean;
  isMandatory: boolean;
  isVisible: boolean;
  userId: number;
  branchId: number;
  companyId: number;
  isActive: boolean;
  isDefult: boolean;
}
export interface GroupConfiguration {
  groupName: string;
  fields: FieldConfiguration[];
}
export interface ModuleConfiguration {
  pIndex: number;
  cIndex: number;
  gcIndex: number;
  module: string;
  form: string;
  group: GroupConfiguration[];
}
export interface ApiResponse {
  data: ModuleConfiguration[];
  status: string;
  errorCode: number;
  userId: number;
}
