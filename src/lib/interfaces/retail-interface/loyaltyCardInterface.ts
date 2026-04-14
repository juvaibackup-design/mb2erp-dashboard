export interface CustomerCard {
  id: number;
  card_no: string;
  card_name: string;
  card_type_code: string;
  is_active: boolean;
}

export interface Card {
  id?: number;
  card_type_code?: string;
  card_no: string;
  card_name: string;
  prefix: string;
  suffix: string;
  auto_number_segment_length: number | null;
  padding_character: number | null;
  start_from: number | null;
  validity_in_months?: number | null;
  validity?: number | null;
  stockpoint_id?: number;
  created_by?: string;
  created_date?: string;
  modified_by?: string | null;
  modified_date?: string | null;
  time_stamp?: string;
  opening_points: number | null;
  // rule_based_on: string[] | null;
  rule_based_on: any | null;
  rule_connection: string;
  referral_points: number | null;
  company_id?: number;
  branch_id?: number;
  is_updated?: boolean;
  is_active?: boolean;
  is_physical_card: boolean;
  offer_points: number | null;
  customerBenefit: Benefit[] | [];
}

export interface Benefit {
  id: string | number;
  key?: number;
  benefit_code?: string;
  name: string;
  description: string;
  discount: number | null;
  for_every_rs: number;
  will_earn_points: number;
  for_every_points: number;
  equivalent_to_rs: number;
  apply_this_benefit_to_promotional_items: boolean;
  stockpoint_id?: number;
  created_by?: string | null;
  created_date?: string;
  modified_by?: string | null;
  modified_date?: string | null;
  time_stamp?: string;
  is_updated?: boolean;
  card_type_code?: string;
  is_active: boolean;
  effect_from: string | Date | null;
  bonus_points: number | null;
  company_id?: number;
  branch_id?: number;
  value_from?: number | null;
  value_to?: number | null;
  walkin_from?: number | null;
  walkin_to?: number | null;
  period_from?: number | null;
  period_to?: number | null;
  setting?: any;
  rule?: string;
}

export interface Rule {
  key?: string | number;
  value_from?: number | undefined;
  value_to?: number | undefined;
  walkin_from?: number | undefined;
  walkin_to?: number | undefined;
  period_from?: number | undefined;
  period_to?: number | undefined;
}

export interface Suffix {
  suffix: string;
}

export interface LoyaltyCard {
  customerBenefit: Benefit[];
  customerCardTypes: Card[];
  maximumBenifitCode: number;
  last_Card_No: string;
}
