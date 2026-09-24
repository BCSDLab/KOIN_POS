import { useQuery } from '@tanstack/react-query';
import { getOrderCounts, getOrderDetail, getOrderList } from './client';

export const useGetOrderList = (orderableShopId: number, status: string) => {
  return useQuery({
    queryKey: ['owner', 'order', orderableShopId, status],
    queryFn: () => getOrderList(orderableShopId, status),
    refetchInterval: 3000
  });
};

export const useGetOrderCount = (orderableShopId: number) => {
  return useQuery({
    queryKey: ['owner', 'order', 'count', orderableShopId],
    queryFn: () => getOrderCounts(orderableShopId)
  });
};

export const useGetOrderDetail = (orderableShopId: number, orderId: number | null) => {
  return useQuery({
    queryKey: ['owner', 'order', orderableShopId, orderId],
    queryFn: () => getOrderDetail(orderableShopId, orderId as number),
    enabled: orderId !== null
  });
};
