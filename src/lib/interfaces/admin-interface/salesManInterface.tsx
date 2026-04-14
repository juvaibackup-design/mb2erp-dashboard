export interface Salesman {
  id: number;
  salesman_code: string;
  salesman_name: string;
  site: number | null;
  time_stamp: string;
  image: string;
  image_data?: {
    // ✅ Ensure image_data is correctly typed
    fileName: string | null;
    fileData: string | null;
    fileType: string | null;
  };
  is_active: boolean;
  user_id: any;
}

export interface dropdownList {
  branchId: number;
  branchName: string;
  contact_person: string;
  primary_number: string;
  is_active: boolean;
  is_head_office: boolean;
}

export interface userList {
  id: number;
  full_name: string;
  branch: string;
  first_name: string;
  is_active: boolean;
  is_head_office: boolean;
}

export interface ApiResponse {
  data: {
    salesMan: Salesman[];
    dropdownList: dropdownList[];
  };
  status: string;
  errorCode: number;
  userId: number;
}
//  export interface SiteOption {
//   value: number; // or string, depending on your data
//   label: string;
//   is_active?: boolean; // Ensure this matches your data structure
// }
