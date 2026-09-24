import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchOrderStatus, patchStoreStatus } from './client';
import type { ChangeOrderStatus, ChangeStoreStatus } from './entity';

export const usePatchOrderStatus = (orderableShopId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { orderId: number; request: ChangeOrderStatus }) =>
      patchOrderStatus(orderableShopId, params.orderId, params.request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'order'] });
    }
  });
};

export const usePatchStoreStatus = (orderableShopId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: ChangeStoreStatus) => patchStoreStatus(orderableShopId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'shops'] });
    }
  });
};
