export interface Bin {
  id?: number | null;
  bin_id: number | null;
  type: string;
  bin_name: string;
  bin_code: string;
  bin_capacity: number | null;
  status: string;
  site_id: number | null;
  stockpoint_id: number | null;
  floor: string;
  dimension: string;
  bin_image: string;
  no_of_shelves: number | null;
  no_of_partition: number | null;
  under: string;
  length: number | null;
  width: number | null;
  height: number | null;
  created_date: string;
  modify_date: string;
  company_id: number | null;
  branch_id: number | null;
  is_active: boolean;
  bin_group_id: number | null;
  imageData: {
    FileName: string;
    FileData: string;
    FileType: string;
  };
}

export interface BinType {
  id: number;
  name: string;
}
