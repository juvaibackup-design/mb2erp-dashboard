export interface Day {
  day: number;
  day_name: string;
}

export interface Suffix {
  value: string;
  name: string;
}

export interface GenerateAutoNum {
  value: string;
  name: string;
}

export interface SubModule {
  value: string;
  name: string;
  subModuleMenu?: any[];
}

export interface Module {
  moduleName: string;
  subModules: SubModule[];
}
export interface SchemeData {
  id: number;
  module_name: string;
  sub_module_name: string;
  prefix: string;
  suffix: string;
  starting_from: string;
  segment: number;
  effects_from: string;
  reset_auto_no: string;
  month: string;
  start_week: number;
  document_no: string;
  stockpoint_id: number;
  time_stamp: string;
  add_unique: boolean;
  u_prefix: string;
  u_suffix: string;
  u_number: string;
  voucher_type_id: number;
  company_id: number;
  branch_id: number;
  is_active: boolean;
  start_date: string;
  based_on: string;
  p_index: number;
  c_index: number;
  gc_index: number;
  t_prefix: boolean;
  month_date: string;
  seperator: string;
}
export interface NumberingScheme {
  start_of_the_week: Day[];
  suffix: Suffix[];
  generate_auto_num: GenerateAutoNum[];
  moduleList: Module[];
  submodule: SubModule[];
  SchemeData: SchemeData[];
  category: Category[];
}

export interface Category {
  categoryId: number;
  categoryName: string;
}
