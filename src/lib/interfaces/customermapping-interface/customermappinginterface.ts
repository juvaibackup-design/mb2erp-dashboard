export interface DashboardSummary {
  totalCustomers: number;
  mapped: number;
  pendingReview: number;
  blockedOrDuplicate: number;
}

export interface CustomerRow {
  id: number;
  mindbody_client_id: string;
  customer_name: string;
  email: string;
  phone: string;
  location: string;
  d365account: string;
  status: string;
  syncdate: string | null;
}

export interface CustomerMappingResponse {
  dashboard: DashboardSummary;
  customer: CustomerRow[];
}