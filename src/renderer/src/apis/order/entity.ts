export type ORDER_TYPE = 'TAKE_OUT' | 'DELIVERY';
export type ORDER_STATUS =
  'CONFIRMING' | 'COOKING' | 'PACKAGED' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED' | 'CANCELED';

export interface OrderListResponse {
  total_count: number;
  orders: OrderList[];
}

export interface OrderInfo {
  id: number;
  order_number: string;
  order_type: ORDER_TYPE;
  order_status: ORDER_STATUS;
  ordered_at: string;
}

export interface OrderList extends OrderInfo {
  estimated_at: string;
  total_price: number;
}

export interface OrderCountResponse {
  new_count: number;
  cooking_count: number;
  delivering_count: number;
  completed_count: number;
}

export interface OrderOptions {
  option_group_name: string;
  option_name: string;
  option_price: number;
  quantity: number;
}

export interface OrderMenus {
  id: number;
  menu_name: string;
  menu_price_name: string;
  menu_price: number;
  quantity: number;
  options: OrderOptions[];
}

export interface Receiver {
  name: string;
  phone_number: string;
  address: string;
  address_detail: string;
  to_owner: string;
  to_rider: string;
  provide_cutlery: boolean;
}

export type PaymentMethod =
  | 'CARD'
  | 'VIRTUAL_ACCOUNT'
  | 'EASY_PAY'
  | 'MOBILE_PHONE'
  | 'ACCOUNT_TRANSFER'
  | 'CULTURE_GIFT_CERTIFICATE'
  | 'BOOK_CULTURE_GIFT_CERTIFICATE'
  | 'GAME_CULTURE_GIFT_CERTIFICATE';

interface Payment {
  method: PaymentMethod;
  approved_at: string;
  total_product_price: number;
  delivery_tip: number;
  discount_amount: number;
  total_price: number;
}

export interface OrderDetail extends OrderInfo {
  order_menus: OrderMenus[];
  receiver: Receiver;
  payment: Payment;
  completed_at: string | null;
  canceled_at: string | null;
  canceled_reason: string | null;
}

export interface ChangeOrderStatus {
  status: ORDER_STATUS;
  estimated_minutes: number | null;
  canceled_reason: string | null;
}

export interface ChangeStoreStatus {
  is_open: boolean;
}
