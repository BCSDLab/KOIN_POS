export interface OwnerShopsResponse {
  total_count: number;
  shops: OwnerShops[];
}

export interface OwnerShops {
  orderable_shop_id: number;
  shop_id: number;
  name: string;
  address: string;
  is_open: boolean;
}
