export interface Branch {
  area_name: string;
  village_name: any;
  id: number;
  company_id: number;
  branch_name: string;
  address?: string;
  address1?: string;
  address2?: string;
  state: string;
  country: string;
  zip_code?: string;
  contact_person: string;
  primary_number: string;
  secondary_number?: string;
  financial_start: string; // Assuming date string format, you can change it to Date if needed
  financial_end: string; // Assuming date string format, you can change it to Date if needed
  created_at?: string; // Assuming date-time string format, you can change it to Date if needed
  updated_at?: string; // Assuming date-time string format, you can change it to Date if needed
  is_active?: boolean;
  is_deleted?: boolean;
  initial?: string;
  barcode: string;
  city: string;
  fax?: string;
  email: string;
  website?: string;
  administrator?: string;
  password?: string;
  tin_no?: string;
  cst_no: string;
  tag_line?: string;
  alias_name: string;
  head_office: string;
  comp_grp: string;
  total_sqft?: number;
  usable_sqft?: number;
  dates?: string;
  client_loc_id?: string;
  setup_id?: number;
  nolc?: string;
  currency_id: number;
  date_format: string;
  sales_forecast?: string;
  replenishment?: string;
  nodp?: string;
  pan: string;
  i_gst?: string;
  ie_code: string;
  mfg: string;
  plot_id?: string;
  street_id?: string;
  village_id?: string;
  city_id?: string;
  zone_id?: string;
  state_id?: string;
  country_id?: string;
  custom_text1?: string;
  custom_text2?: string;
  custom_text3?: string;
  custom_text4?: string;
  custom_text5?: string;
  custom_combo1?: string;
  custom_combo2?: string;
  custom_ratio1?: string;
  custom_ratio2?: string;
  custom_date1?: string;
  custom_date2?: string;
  property_type?: string;
  rent?: string;
  customer_ent_id?: string;
  party_ent_id?: string;
  cash_ledger_id?: string;
  created_by?: string;
  updated_by?: string;
  mobile_code: string;
  area: string;
  industry: string;
  about_us: string;
  vision: string;
  mission: string;
  transfer_based_on: string;
  price_rule: number;
  location_type: string;
}

export interface CompanyGroup {
  id: number;
  group_name: string;
  comp_grp_code: string;
  company_id: number;
  branch_id: number;
  is_active: boolean;
}

export interface DecimalList {
  nodp: string;
}

export interface CurrencySetup {
  setupId: number;
  currencyName: string;
  symbol: string;
}

export interface CashLedger {
  cashledgerid: number;
  name: string;
}

export interface Location {
  state_code: string | number;
  stc_id: number;
  street: string;
  vc_id: number;
  village: string;
  a_id: number;
  area: string;
  c_id: number;
  city: string;
  sc_id: number;
  state: string;
  country_id: number;
  country: string;
  zipcode: number;
}

export interface City {
  stc_id: number;
  street: string;
  vc_id: number;
  village: string;
  c_id: number;
  city: string;
  dc_id: number;
  district: string;
  sc_id: number;
  state: string;
  country_id: number;
  country: string;
  zipcode: number;
}

interface LocationDetail {
  id: number;
  company_id: number;
  branch_name: string;
  address1: string;
  address2: string;
  state: string;
  country: string;
  zip_code: string;
  contact_person: string;
  primary_number: string;
  secondary_number: string;
  financial_start: string;
  financial_end: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_deleted: boolean;
  initial: string;
  barcode: string;
  city: string;
  fax: string;
  email: string;
  website: string;
  administrator: string;
  password: string;
  tin_no: string;
  cst_no: string;
  tag_line: string;
  alias_name: string;
  head_office: string;
  comp_grp: string;
  total_sqft: number;
  usable_sqft: number;
  dates: string;
  client_loc_id: string;
  setup_id: null | string;
  nolc: string;
  currency_id: number;
  date_format: string;
  sales_forecast: string;
  replenishment: string;
  nodp: string;
  pan: string;
  i_gst: string;
  ie_code: string;
  mfg: string;
  plot_id: string;
  street_id: string;
  village_id: string;
  city_id: string;
  zone_id: string;
  state_id: string;
  country_id: string;
  custom_text1: string;
  custom_text2: string;
  custom_text3: string;
  custom_text4: string;
  custom_text5: string;
  custom_combo1: string;
  custom_combo2: string;
  custom_ratio1: string;
  custom_ratio2: string;
  custom_date1: string;
  custom_date2: string;
  property_type: string;
  rent: string;
  customer_ent_id: string;
  party_ent_id: string;
  cash_ledger_id: string;
  created_by: string;
  updated_by: string;
}

interface Industry {
  id: number;
  industry: string;
}

export interface LocationDetailsContainer {
  locationDetails: LocationDetail[];
}

export interface Site {
  branch: Branch[];
  companyGroups: CompanyGroup[];
  decimallist: DecimalList[];
  exceptBranch: null;
  currencySetup: CurrencySetup[];
  getCashLedgerlst: CashLedger[];
  country: Location[];
  state: Location[];
  district: Location[];
  citys: City[];
  areas: Location[];
  industry: Industry[];
  priceRule: any[];
  transferBasedOn: any[];
}

export interface InitialValues {
  id?: number;
  mop: string;
  description: string;
  denomination: boolean;
  ordered: number;
  ledger_id: any;
  is_active: boolean;
  branch_id?: string | string[];
  company_id?: number;
  image_id: number;
  image?: string;
}

export interface SavedMOP {
  id: number;
  mop: string;
  description: string;
  denomination: boolean;
  ordered: number;
  ledger_id: number;
  is_active: boolean;
  dept_id: number;
  image: Images[];
}

export interface Images {
  id: number;
  image: string;
  url: string;
}

export interface LedgerDetails {
  id: number;
  name: string;
  group_name: string;
}

export interface DepartmentList {
  grp_code: number;
  p_index: number;
  c_index: number;
  gc_index: number;
  department: string;
  section: string;
  division: string;
  bool: boolean;
}

export interface Id {
  siteDetails: Branch[];
  siteCreation: Site;
  setActiveKey: Function;
  isActive?: boolean;
  access: any;
  setupTour: any;
  setSetuptour: any;
  setupTourStepIndex: any;
  setSetupTourStepIndex: any;
  setshowTour: any;
  showTour: any;
  stockPointTour: any;
  setStockPointTour: any;
  activeKey?: any;
  menuKey?: any;
}

export interface MopData {
  savedMOP: SavedMOP[];
  ledgerDetails: LedgerDetails[];
  departmentList: DepartmentList[];
}

export interface Select {
  label: string;
  value: number;
}

export interface SelectGroup {
  label: string;
  options: { label: string; value: number }[];
}

export interface Currency {
  setupId: number;
  currencyName: string;
  symbol: string;
  branchId: number;
  companyId: number;
}

export interface CurrencyInfo {
  setup_id?: number;
  currency_id: string;
  currency_name: string;
  symbol: string;
  unit: string;
  sub_unit: string;
  round_off: string;
  value: string;
  base_currency: boolean;
  is_active?: boolean;
  company_id?: string;
}

/************************/

export const postData = {
  id: 0,
  company_id: 1,
  // branch_name: "ICUBE",
  // "address1": "",
  address2: "",
  // "state": "",
  // "country": "INDIA                                             ",
  zip_code: "",
  // "contact_person": "admin",
  // "primary_number": "23456",
  secondary_number: "",
  financial_start: "1900/01/01",
  financial_end: "1900/01/01",
  created_at: "",
  updated_at: "",
  is_active: true,
  is_deleted: false,
  initial: "",
  barcode: "",
  // city: "",
  fax: "",
  // "email": "xyz@gmail.com",
  website: "",
  administrator: "",
  password: "",
  tin_no: "",
  // cst_no: "",
  tag_line: "",
  // alias_name: "",
  // head_office: "",
  // comp_grp: "CG0001",
  total_sqft: 0,
  usable_sqft: 0,
  dates: "1900/01/01",
  client_loc_id: "",
  setup_id: null,
  nolc: "",
  currency_id: 0,
  date_format: "",
  sales_forecast: true,
  replenishment: true,
  nodp: "0",
  pan: "",
  i_gst: "",
  ie_code: "",
  mfg: 1,
  plot_id: "",
  street_id: "",
  village_id: "",
  city_id: "",
  zone_id: "",
  state_id: "",
  country_id: "",
  custom_text1: "",
  custom_text2: "",
  custom_text3: "",
  custom_text4: "",
  custom_text5: "",
  custom_combo1: "p_custom_combo1",
  custom_combo2: "p_custom_combo2",
  custom_ratio1: "",
  custom_ratio2: "",
  custom_date1: "",
  custom_date2: "",
  property_type: "",
  rent: "1",
  customer_ent_id: "0",
  party_ent_id: "1",
  cash_ledger_id: "1",
  created_by: "",
  updated_by: "",
  currency: null,
};

export const setupPostData = {
  // id: 17,
  company_id: 1,
  // branch_name: "code test",
  // address1: "190                                               ",
  address2: "",
  // state: "",
  // country: "",
  zip_code: "",
  // contact_person: "admin",
  // primary_number: "23456",
  // secondary_number: "",
  // financial_start: "2022-04-01T00:00:00",
  // financial_end: "2023-03-31T00:00:00",
  created_at: "2023-12-13T15:50:24.996014",
  updated_at: "2023-12-13T15:50:24.996014",
  // is_active: true,
  is_deleted: false,
  initial: "",
  // barcode: "AAAA",
  // city: "",
  fax: "",
  email: "",
  website: "",
  administrator: "",
  password: "",
  // tin_no: "12",
  // cst_no: "33ABMFA4831E1ZQ",
  tag_line: "",
  // alias_name: "a",
  // head_office: "HO",
  // comp_grp: "CG0001",
  total_sqft: 0,
  usable_sqft: 0,
  dates: "",
  client_loc_id: "",
  setup_id: 0,
  nolc: "",
  // currency_id: 103,
  // date_format: "DD-MM-YYYY",
  sales_forecast: "",
  replenishment: false,
  nodp: "0",
  // pan: "ATHGI7789L",
  i_gst: "",
  ie_code: "",
  // mfg: "1",
  plot_id: "",
  street_id: "",
  // village_id: "",
  // city_id: "",
  zone_id: "",
  // state_id: "",
  // country_id: "",
  custom_text1: "",
  custom_text2: "",
  custom_text3: "",
  custom_text4: "",
  custom_text5: "",
  custom_combo1: "",
  custom_combo2: "",
  custom_ratio1: "",
  custom_ratio2: "",
  custom_date1: "",
  custom_date2: "",
  property_type: "",
  rent: "",
  customer_ent_id: "",
  party_ent_id: "",
  cash_ledger_id: "",
  // created_by: "",
  // updated_by: "",
  // mobile_code: "23456_code",
  currency: "",
  about_us: "",
  vision: "",
  mission: "",
};

export interface FormFieldInterface {
  id: number;
  label: any;
  name: string;
  isRequired?: boolean;
  component: string;
  options?: CompanyGroup[] | Location[] | Industry[] | any[];
  optionFName?: string;
  optionFVal?: string;
  description?: string;
  scrollIntoView?: any;
}
