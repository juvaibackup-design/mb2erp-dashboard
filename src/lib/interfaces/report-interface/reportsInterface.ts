export interface MenuItem {
  menuName: string;
  moduleName: string;
  pindex: number;
  cindex: number;
  gcindex: number;
  designTypeId: number;
  sno: string;
}

export interface ModuleData {
  module: string;
  menu: MenuItem[];
}

export interface ApiResponse {
  data: ModuleData[];
  userid: number;
  status: string;
  code: number;
  errordescription: string | null;
  errors: string | null;
}
