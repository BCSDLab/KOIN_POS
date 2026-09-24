export type OrderType = 'DELIVERY' | 'TAKE_OUT';

export type OrderStatus =
  'CONFIRMING' | 'COOKING' | 'PACKAGED' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED' | 'CANCELED';

export type PaymentMethod =
  | 'CARD'
  | 'VIRTUAL_ACCOUNT'
  | 'EASY_PAY'
  | 'MOBILE_PHONE'
  | 'ACCOUNT_TRANSFER'
  | 'CULTURE_GIFT_CERTIFICATE'
  | 'BOOK_CULTURE_GIFT_CERTIFICATE'
  | 'GAME_CULTURE_GIFT_CERTIFICATE';

export interface OrderOption {
  option_group_name: string;
  option_name: string;
  option_price: number;
  quantity: number;
}

export interface OrderMenu {
  id: number;
  menu_name: string;
  menu_price_name: string;
  menu_price: number;
  quantity: number;
  options: OrderOption[];
}

export interface OrderReceiver {
  name: string;
  phone_number: string;
  address: string;
  address_detail: string;
  to_owner: string;
  to_rider: string;
  provide_cutlery: boolean;
}

export interface OrderPayment {
  method: PaymentMethod;
  approved_at: string;
  total_product_price: number;
  delivery_tip: number;
  discount_amount: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  order_type: OrderType;
  order_status: OrderStatus;
  ordered_at: string;
  order_menus: OrderMenu[];
  receiver: OrderReceiver;
  payment: OrderPayment;
  completed_at: string | null;
  canceled_at: string | null;
  canceled_reason: string | null;
}

export interface OrderTab {
  key: string;
  label: string;
  statuses: OrderStatus[];
}

export interface OrderStatusCounts {
  new_count: number;
  cooking_count: number;
  delivering_count: number;
  completed_count: number;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  open: boolean;
}
