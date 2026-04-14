export interface priceList {
  id: number;
  price_list: string;
  sign: string;
  based_on: string;
  type: string;
  factor: number;
  is_active: boolean;
  branch_name: string;
  branch_id: number;
  company_id: number;
  is_cus_allowable: boolean;
}
export interface bindLocations {
  id: number;
  branch_name: string;
}

export interface basedON {
  based_on: string;
}
export interface ApiResponse {
  data: {
    bindLocations: bindLocations[];
    basedON: basedON[];
    priceList: priceList[];
  };
  userid: number;
  status: string;
  code: number;
  errordescription: null | string;
}
