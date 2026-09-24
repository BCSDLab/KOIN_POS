import { apiClient } from '../apiClient';
import type {
  OrderListResponse,
  OrderCountResponse,
  OrderDetail,
  ChangeOrderStatus,
  ChangeStoreStatus
} from './entity';

export const getOrderList = (orderableShopId: number, status: string) =>
  apiClient.get<OrderListResponse>(`/owner/order/shop/${orderableShopId}/orders`, {
    authorization: true,
    params: { status }
  });

export const getOrderCounts = (orderableShopId: number) =>
  apiClient.get<OrderCountResponse>(`/owner/order/shop/${orderableShopId}/orders/counts`, {
    authorization: true
  });

export const getOrderDetail = (orderableShopId: number, orderId: number) =>
  apiClient.get<OrderDetail>(`/owner/order/shop/${orderableShopId}/orders/${orderId}`, {
    authorization: true
  });

export const patchOrderStatus = (
  orderableShopId: number,
  orderId: number,
  request: ChangeOrderStatus
) =>
  apiClient.patch<ChangeOrderStatus>(
    `/owner/order/shop/${orderableShopId}/orders/${orderId}/status`,
    request,
    { authorization: true }
  );

export const patchStoreStatus = (orderableShopId: number, request: ChangeStoreStatus) =>
  apiClient.patch<ChangeStoreStatus>(`/owner/order/shop/${orderableShopId}/open`, request, {
    authorization: true
  });
