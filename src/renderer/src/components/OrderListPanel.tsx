import { useGetOrderList } from '@renderer/apis/order/queries';
import QueryStateGate from './QueryStateGate';
import SectionHeader from './SectionHeader';
import OrderListItem from './OrderListItem';
import { sectionLabel, rowSubLabel, statusKey } from '../lib/dashboard';
import type { TabKey } from '../lib/dashboard';

interface OrderListPanelProps {
  orderableShopId: number;
  activeTab: TabKey;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function OrderListPanel({
  orderableShopId,
  activeTab,
  selectedId,
  onSelect
}: OrderListPanelProps) {
  const orderListRes = useGetOrderList(orderableShopId, statusKey[activeTab]);
  const orderList = orderListRes.data?.orders ?? [];
  const isOffline = orderListRes.fetchStatus === 'paused';
  const deliveryRows = orderList.filter((o) => o.order_type === 'DELIVERY');
  const takeoutRows = orderList.filter((o) => o.order_type === 'TAKE_OUT');

  return (
    <QueryStateGate
      isPending={orderListRes.isPending}
      isError={orderListRes.isError}
      isOffline={isOffline}
      length={orderList.length}
      errorMessage={orderListRes.error?.message}
      onRetry={() => orderListRes.refetch()}
    >
      {deliveryRows.length > 0 && (
        <div>
          <SectionHeader label={sectionLabel(activeTab, 'DELIVERY')} count={deliveryRows.length} />
          {deliveryRows.map((row) => (
            <OrderListItem
              key={row.id}
              no={row.order_number}
              type={row.order_type === 'DELIVERY' ? '배달' : '포장'}
              sub={rowSubLabel(row)}
              selected={row.id === selectedId}
              onClick={() => onSelect(row.id)}
            />
          ))}
        </div>
      )}
      {takeoutRows.length > 0 && (
        <div>
          <SectionHeader label={sectionLabel(activeTab, 'TAKE_OUT')} count={takeoutRows.length} />
          {takeoutRows.map((row) => (
            <OrderListItem
              key={row.id}
              no={row.order_number}
              type={row.order_type === 'DELIVERY' ? '배달' : '포장'}
              sub={rowSubLabel(row)}
              selected={row.id === selectedId}
              onClick={() => onSelect(row.id)}
            />
          ))}
        </div>
      )}
    </QueryStateGate>
  );
}
