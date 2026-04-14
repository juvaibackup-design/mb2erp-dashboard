export interface employeeList {
  id: number;
  branch_id: number[];
  is_active: boolean;
  is_user: boolean;
  dob: string; // ISO date string
  blood_group: string | null;
  department: string | null;
  department_code: string | null;
  designation: string | null;
  designation_code: string | null;
  employee_id: number | null;
  full_name: string;
  loggin_name: string;
  password: string;
  role_id: string;
  role_name: string;
  user_name: string;
  user_preffix: string;
  user_suffix: string;
  pos_code: string | null;
  branch: string; // JSON string
  primary_phone_number: number | null;
  is_primary: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  is_primary_branch_id: number | null;
  is_allow_save_password: boolean;
  idle_minutes: string;
  stockpoint_id: string;
  concat_index: string;
  imageData: {
    FileName: string;
    FileData: string;
    FileType: string;
  };
  enable_two_factor: boolean;
  is_whitelist_enable: boolean;
  enable_single_user: boolean;
}

export interface departmentList {
  department_code: string;
  initial: string;
  department: string;
}

export interface roleList {
  role_id: number;
  role_name: string;
  ent_id: number;
  is_active: boolean;
}
export interface Branch {
  id: number;
  branch_name: string;
}

export interface userList {
  employee_id: string;
  full_name: string;
  is_user: boolean;
  is_active: boolean;
  department: string;
}

export interface ApiResponse {
  data: {
    employeeList: employeeList[];
    departmentList: departmentList[];
    roleList: roleList[];
    userInformation: userList[];
    branch: Branch[];
  };
  status: string;
  errorCode: number;
}

export interface defaultLandingPage {
  form_id: number;
  form_name: string;
  p_index: number;
  c_index: number;
  gc_index: number;
  concat_index: string;
  module_name: string;
}
