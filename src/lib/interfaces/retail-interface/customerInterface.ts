export interface SubLedger {
  r_group_name: string;
  r_gl_name: string;
  r_sl_name: string;
  r_sl_id: number;
}

export interface CardType {
  r_card_name: string;
  r_card_type_code: string;
  r_is_active: boolean;
}

export interface Gender {
  name: string;
}

export interface Religion {
  name: string;
}

export interface MartialStatus {
  name: string;
}

export interface Member {
  cardNo: string;
  companyPrefix: string;
  id: number;
  memberNo: string;
  displayName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  cardType: string;
  mobileNo: string;
  whatsappno: string;
  isActive: boolean;
}

export interface ReferenceMember {
  cardNo: string;
  companyPrefix: string;
  id: number;
  memberNo: string;
  displayName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  cardType: string;
  mobileNo: string;
  whatsappno: string;
}

export interface PriceList {
  r_price_list: string;
  r_id: number;
}

export interface Country {
  r_cyc_id: number;
  r_country: string;
}

export interface BenefitType {
  r_benefit_name: string;
  r_description: string;
  r_discount: number;
  r_for_every_rs: number;
  r_will_earn_points: number;
  r_for_every_points: number;
  r_equivalent_to_rs: number;
  r_beneit_code: string;
}
export interface State {
  c_id: number;
  type_id: number;
  name: string;
}
export interface City {
  c_id: number;
  type_id: number;
  name: string;
}
export interface Area {
  c_id: number;
  type_id: number;
  name: string;
}
export interface ResponseData {
  sub_ledger: SubLedger[];
  card_type: CardType[];
  gender: Gender[];
  religion: Religion[];
  martial_status: MartialStatus[];
  members: Member[]; // Array of Member objects
  reference_member: ReferenceMember[]; // Array of ReferenceMember objects
  price_list: PriceList[];
  country: Country[];
  benefit_type: BenefitType[];
  state: State[];
  city: City[];
  area: Area[];
}
export interface ExtinctValues {
  gender: string;
  religion: string;
  married: string;
  sub_ledger_id: string;
  card_type: string | null;
  ref_member_no: string | number;
  price_list: string | number;
  country_id: null;
  benefit_code: string;
  state_id: number | null;
  city_id: null;
  area_id: null;
  street: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  mobile_no: string;
  email_id: string;
  dob: null;
  profession: string;
  dom: null;
  gst_no: string;
  pan_no: string;
  whatsapp_no: string;
  building_no: string;
  member_no: string;
  card_no: string;
  pincode: string;
  is_active: boolean;
  image_data: [
    {
      FileName: string;
      FileData: string;
      FileType: string | undefined;
    }
  ];
}
export interface ApiResponse {
  data: ResponseData;
  status: string;
  statusCode: number;
}
