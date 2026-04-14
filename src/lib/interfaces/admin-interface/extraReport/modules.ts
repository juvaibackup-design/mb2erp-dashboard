export interface ModuleName {
  d(d: any): string;
  id: any;
  pIndex: number;
  moduleName: string;
}

export interface ExtraReportResponse {
  data: {
    moduleNameList: ModuleName[];
    formNameList: any[] | null;
    extraReportFileDetails: any | null;
    dataSourceList: any | null;
    imageByIdDetails: any | null;
  };
  userid: number;
  status: string;
  code: number;
  errordescription: string | null;
  errors: any | null;
  error: any | null;
}
export interface ExtraReportApiResponse {
  data: {
    moduleNameList: ModuleName[] | null;
    formNameList: FormName[];
    extraReportFileDetails: any | null;
    dataSourceList: any | null;
    imageByIdDetails: any | null;
  };
  userid: number;
  status: string;
  code: number;
  errordescription: string | null;
  errors: any | null;
  error: any | null;
}

export interface ModuleName {
  pIndex: number;
  moduleName: string;
}

export interface FormName {
  formId: number;
  formName: string;
  pIndex: number;
  cIndex: number;
  gcIndex: number;
}

