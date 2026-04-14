export interface Discount {
  id?: number | null;
  serial_no?: number;
  discount_name: string;
  type: boolean | any;
  factor: number;
  module_type: string | string[];
  company_id?: number;
  branch_id?: number;
  is_active: boolean;
  allow_changeable: boolean;
  profile_list: string | string[];
  location_list: string | string[];
}

export interface Profile {
  ent_id: number;
  profile_Id: string;
  profile_Name: string;
  selectLocation: null | string;
}

export interface Location {
  id: string;
  branch_Name: string;
  selectLocation: string;
}

export interface Module {
  moduleName: string;
}

export interface DiscountData {
  discountInitialData: {
    pos: Discount[];
    sales: Discount[];
    products: Discount[];
    profileList: Profile[];
    locationList: Location[];
    moduleList: Module[];
  };
  userid: null | string;
  status: string;
  code: number;
  errordescription: null | string;
}
