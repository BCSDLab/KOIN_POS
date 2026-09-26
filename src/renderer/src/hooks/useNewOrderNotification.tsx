import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useGetOrderList } from '@renderer/apis/order/queries';
import { getInitialBooleanSetting } from '@renderer/lib/storage';
import { SingleNewOrderToast, MultiNewOrderToast } from '../components/NewOrderToast';
import notificationSound from '../assets/notification.mp3';

function playAlertSound(): void {
  if (!getInitialBooleanSetting({ key: 'soundAlert', initialValue: true })) return;
  new Audio(notificationSound).play();
  setTimeout(() => new Audio(notificationSound).play(), 2000);
}

export function useNewOrderNotification(
  orderableShopId: number,
  onView: (orderId?: number) => void
): void {
  const newOrdersRes = useGetOrderList(orderableShopId, 'NEW');
  const seenNewOrderIdsRef = useRef<Set<number> | null>(null);

  useEffect(() => {
    if (newOrdersRes.data === undefined) return;

    const currentOrders = newOrdersRes.data?.orders ?? [];
    const currentIds = new Set(currentOrders.map((o) => o.id));
    const seenIds = seenNewOrderIdsRef.current;
    seenNewOrderIdsRef.current = currentIds;

    if (seenIds === null) return;

    const arrivedOrders = currentOrders.filter((o) => !seenIds.has(o.id));
    if (arrivedOrders.length === 0) return;

    playAlertSound();

    if (arrivedOrders.length === 1) {
      const arrivedOrder = arrivedOrders[0];
      toast.custom(
        (toastId) => (
          <SingleNewOrderToast
            order={arrivedOrder}
            onView={() => {
              onView(arrivedOrder.id);
              toast.dismiss(toastId);
            }}
            onClose={() => toast.dismiss(toastId)}
          />
        ),
        { duration: Infinity }
      );
    } else {
      const deliveryCount = arrivedOrders.filter((o) => o.order_type === 'DELIVERY').length;
      toast.custom(
        (toastId) => (
          <MultiNewOrderToast
            count={arrivedOrders.length}
            deliveryCount={deliveryCount}
            takeoutCount={arrivedOrders.length - deliveryCount}
            onView={() => {
              onView();
              toast.dismiss(toastId);
            }}
          />
        ),
        { duration: Infinity }
      );
    }
  }, [newOrdersRes.data, onView]);
}
