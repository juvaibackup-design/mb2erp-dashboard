interface PrimaryGroup {
  code: string;
  name: string;
}

interface GLedger {
  gl_id: number;
  gl_name: string;
  gname: string;
}

interface CalculatedOn {
  based_on: string;
}

interface Country {
  stc_id: number | any;
  street: string;
  vc_id: number | any;
  village: string;
  cc_id: number | any;
  city: string;
  dc_id: number | any;
  district: string;
  sc_id: number | any;
  state: string;
  country_id: 1;
  country: string;
  zipcode: number | any;
}

interface CustRating {
  rating: string;
}

interface GetType {
  partyType: string;
  partyType_Edit_Value: string;
}

interface LocationList {
  branch_id: number;
  branch_name: string;
}

interface PaymentTerm {
  id: number;
  term_name: string;
}

interface TaxList {
  tax_code: number;
  tax_name: string;
}

interface PartyAlias {
  party_code: string;
  party_name: string;
  party_type: string;
  group_code: string;
  contact: string;
  street: string;
  city: string;
  states: string;
  pincode: string;
  country: string;
  telephone: string;
  mobile: string;
  fax: string;
  email: string;
  ent_id: number;
  party_id: string;
}

interface SaleType {
  sales_type: string;
}

interface AccountManager {
  emp_id: number;
  code: string;
  salesman_code: string;
  name: string;
}

interface Term {
  term_name: string;
  term_code: string;
  is_active: boolean;
}

interface Agent {
  code: string;
  name: string;
}

interface Transporter {
  code: string;
  name: string;
}

interface State {
  stc_id: number | any;
  street: string;
  vc_id: number | any;
  village: string;
  cc_id: number | any;
  city: string;
  dc_id: number | any;
  district: string;
  sc_id: number | any;
  state: string;
  country_id: 1;
  country: string;
  zipcode: number | any;
}

interface Street {
  c_id: number;
  street: string;
  village: string;
  city: string;
  district: string;
  state: string;
  country: string;
}

interface Village {
  stc_id: number | any;
  street: string;
  vc_id: number | any;
  village: string;
  cc_id: number | any;
  city: string;
  dc_id: number | any;
  district: string;
  sc_id: number | any;
  state: string;
  country_id: 1;
  country: string;
  zipcode: number | any;
}

interface Taluk {
  r_cid: number;
  r_city: string;
  r_district: string;
  r_state: string;
  r_country: string;
}

interface CurrencyDetails {
  setup_id: number;
  currency_name: string;
  symbol: string;
}

interface BusinessPartnerCodeGenerationBasedOnType {
  prefix: string;
  last_no: number;
  max_ent_id: number;
}

interface City {
  stc_id: number;
  street: string;
  vc_id: number;
  village: string;
  cc_id: number;
  city: string;
  dc_id: number;
  district: string;
  sc_id: number;
  state: string;
  country_id: number;
  country: string;
  zipcode: number;
}
interface District {
  stc_id: number;
  street: string;
  vc_id: number;
  village: string;
  cc_id: number;
  city: string;
  dc_id: number;
  district: string;
  sc_id: number;
  state: string;
  country_id: number;
  country: string;
  zipcode: number;
}

interface PriceRule {
  id: number;
  price_list: string;
  sign: string;
  based_on: string;
  type: string;
  factor: number;
}

interface Department {
  departmentid: number;
  department: string;
}

interface customerAlias {
  r_customer_code: string;
  r_customer_name: string;
  r_sales_type: string;
  r_contact: string;
  r_street?: string;
  r_city?: string;
  r_states: string;
  r_pincode: number;
  r_country?: string;
  r_telephone?: string;
  r_mobile?: string;
  r_fax?: string;
  r_email?: string;
  r_remarks?: string;
  r_credit_limit: number;
  r_credit_days: number;
  r_discount: number;
  r_credit_rating?: string;
  r_tin_no?: string;
  r_time_stamp: string;
  r_calc_on: string;
  r_ent_id: number;
  r_customer_id: string;
  r_address2?: string;
  r_stocpoint_id: string;
  r_branch_id: number;
  r_company_id: number;
  r_shipping_address1?: string;
  r_shipping_address2?: string;
  r_shipping_city?: string;
  r_shipping_state?: string;
  r_shipping_pincode?: string;
  r_shipping_mobile?: string;
  r_shipping_telephone?: string;
  r_shipping_fax?: string;
  r_shipping_email?: string;
  r_shipping_country?: string;
  r_log_inward: string;
  r_log_outward: string;
  r_is_updated?: any;
  r_cst_no?: string;
  r_is_active: boolean;
  r_ledger_id: number;
  r_site_id: string;
  r_gst_in?: string;
  r_pan_no?: string;
  r_agent?: string;
  r_transporter?: string;
  r_village?: string;
  r_zone?: string;
  r_c_inward: boolean;
  r_c_outward: boolean;
  r_g_inward: boolean;
  r_g_outward: boolean;
  r_payment_term?: string;
  r_payment_term_default?: string;
  r_is_payment: boolean;
  r_tax_name?: string;
  r_bank_id?: string;
  r_custom_text1?: string;
  r_custom_text2?: string;
  r_custom_text3?: string;
  r_custom_text4?: string;
  r_custom_text5?: string;
  r_custom_combo1?: string;
  r_custom_combo2?: string;
  r_custom_radio1: boolean;
  r_custom_radio2: boolean;
  r_custom_date1: string;
  r_custom_date2: string;
  r_plot_id?: string;
  r_street_id: number;
  r_village_id: number;
  r_city_id: number;
  r_zone_id: number;
  r_state_id: number;
  r_country_id: number;
  r_agent_rate: number;
  r_price_rule: number;
  r_gst_type?: string;
  r_is_rangewise_discount: boolean;
  r_consignment_location_id: number;
  r_lead_days: number;
  r_isd_no: number;
  r_whatsapp_no?: string;
  r_default_termcode?: string;
  r_primary_group?: string;
  r_latitude?: string;
  r_longitude?: string;
  r_products_grpcode?: string;
  r_account_manager_emp_id: number;
  r_login_user_name?: string;
  r_login_password?: string;
  r_is_login_access: boolean;
  r_billing_for: string;
  r_against_lead: number;
}

interface MarginRule {
  rule_code: number;
  rule_name: string;
}

interface Bank {
  id: number;
  bank_name: string;
  branch_name: string;
  account_number: string;
  ifsc_code: string;
  source: string;
}

export interface PartyData {
  partyCode: string;
  primaryGroups: PrimaryGroup[];
  gLedger: GLedger[];
  calculatedOn: CalculatedOn[];
  agent: Agent[];
  transporter: Transporter[];
  country: Country[];
  custRating: CustRating[];
  getType: GetType[];
  locationLists: LocationList[];
  taluk: Taluk[];
  paymentterms: PaymentTerm[];
  currencyDetails: CurrencyDetails[];
  taxList: TaxList[];
  marginRule: MarginRule[];
  partyAlais: PartyAlias[];
  customerAlais: customerAlias[];
  saleType: SaleType[];
  accountManager: AccountManager[];
  department: Department[];
  term: Term[];
  businessPartnerCodeGenerationBasedOnType: BusinessPartnerCodeGenerationBasedOnType[];
  pricerule: PriceRule[];
  bank: Bank[];
  gsttype: any[];
}
