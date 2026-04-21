

export interface Product {
  id: number;
  mindBodyId: string;
  name: string;
  type: string;
  d365ItemId: string | null;
  location: string | null;
  status: string;
  price: number;
  onlinePrice: number | null;
}

export interface ProductDashboard {
  totalProducts: number;
  mapped: number;
  pendingReview: number;
  blockedDuplicate: number;
}

export interface ProductData {
  product: {
    data: Product[];
  };
  productDashboard: ProductDashboard;
}

export interface ApiResponse {
  data: ProductData;
  status: string;
  errorCode: number;
}