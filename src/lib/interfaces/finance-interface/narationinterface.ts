export interface Naration {
    naration: string;
    voucher_type: number;
    is_active: boolean;
    created_user: string;
    created_date: string;
    modified_user: string;
    modified_date: string;
    company_id: number;
    branch_id: number;
    id: number;
    voucherType:number;
    isActive: boolean;
    voucherId:number
  }
  
  export interface Voucher {
    voucher_name: string;
    voucher_type: number;
  }

  // export interface ApiResponse {
  //   data: {
  //     naration: Naration[];
  //   };
  //   userid: null;
  //   status: string;
  //   code: number;
  //   errordescription: null;
  // }
  