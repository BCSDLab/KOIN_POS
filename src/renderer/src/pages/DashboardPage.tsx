import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import SectionHeader from '../components/SectionHeader';
import OrderListItem from '../components/OrderListItem';
import OrderDetail from '../components/OrderDetail';
import ApproveModal from '../components/ApproveModal';
import RejectModal from '../components/RejectModal';
import SettingsModal from '../components/SettingsModal';
import EndBusinessModal from '../components/EndBusinessModal';
import { useGetOrderCount, useGetOrderDetail, useGetOrderList } from '@renderer/apis/order/queries';
import { usePatchOrderStatus, usePatchStoreStatus } from '@renderer/apis/order/mutation';
import type { ORDER_STATUS, ORDER_TYPE, OrderList } from '@renderer/apis/order/entity';
import { formatTime } from '../lib/format';

type TabKey = 'new' | 'cooking' | 'delivering' | 'done';
type ServerStatus = 'NEW' | 'COOKING' | 'DELIVERING' | 'COMPLETED';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'new', label: '신규' },
  { key: 'cooking', label: '조리중' },
  { key: 'delivering', label: '전달중' },
  { key: 'done', label: '완료' }
];

const statusKey: Record<TabKey, ServerStatus> = {
  new: 'NEW',
  cooking: 'COOKING',
  delivering: 'DELIVERING',
  done: 'COMPLETED'
};

const countKey: Record<TabKey, 'new_count' | 'cooking_count' | 'delivering_count' | null> = {
  new: 'new_count',
  cooking: 'cooking_count',
  delivering: 'delivering_count',
  done: null
};

function sectionLabel(tabKey: TabKey, type: ORDER_TYPE): string {
  if (tabKey === 'delivering') {
    return type === 'DELIVERY' ? '배달중' : '포장완료 · 수령 대기';
  }
  return type === 'DELIVERY' ? '배달' : '포장';
}

function rowSubLabel(order: OrderList): string {
  if (order.order_status === 'CANCELED') return '반려';
  if (order.order_status === 'DELIVERED') return `${formatTime(order.estimated_at)} 배달 완료`;
  if (order.order_status === 'PICKED_UP') return `${formatTime(order.estimated_at)} 포장 수령 완료`;
  if (order.order_status === 'CONFIRMING') return `${formatTime(order.ordered_at)} 접수`;
  return `${formatTime(order.estimated_at)} 완료 예정`;
}

// 조리 완료 / 배달·포장 완료처럼 모달 없이 바로 다음 상태로 넘어가는 전이
function nextStatusForTab(tabKey: TabKey, orderType: ORDER_TYPE): ORDER_STATUS | null {
  if (tabKey === 'cooking') return orderType === 'DELIVERY' ? 'DELIVERING' : 'PACKAGED';
  if (tabKey === 'delivering') return orderType === 'DELIVERY' ? 'DELIVERED' : 'PICKED_UP';
  return null;
}

const STORE_NAME = '한끼반점 신전점';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderableShopId = Number(searchParams.get('shopId'));

  const [activeTab, setActiveTab] = useState<TabKey>('new');
  const [manualSelectedId, setManualSelectedId] = useState<number | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [endBusinessOpen, setEndBusinessOpen] = useState(false);

  const orderListRes = useGetOrderList(orderableShopId, statusKey[activeTab]);
  const orderList = orderListRes.data?.orders ?? [];
  const deliveryRows = orderList.filter((o) => o.order_type === 'DELIVERY');
  const takeoutRows = orderList.filter((o) => o.order_type === 'TAKE_OUT');

  const countRes = useGetOrderCount(orderableShopId);
  const counts = countRes.data;

  const selectedId = manualSelectedId ?? orderList[0]?.id ?? null;
  const orderDetailRes = useGetOrderDetail(orderableShopId, selectedId);
  const order = orderDetailRes.data;

  const patchOrderStatus = usePatchOrderStatus(orderableShopId);
  const patchStoreStatus = usePatchStoreStatus(orderableShopId);

  const handleTabChange = (key: string): void => {
    setActiveTab(key as TabKey);
    setManualSelectedId(null);
  };

  const tabsWithCount = tabs.map((tab) => ({
    ...tab,
    count: countKey[tab.key] && counts ? counts[countKey[tab.key]!] : null
  }));

  const isRejected = order?.order_status === 'CANCELED';

  const footerNote =
    activeTab === 'done' && order
      ? isRejected
        ? { label: '반려된 주문입니다', icon: '✕', tone: 'muted' as const }
        : {
            label: `${order.order_status === 'DELIVERED' ? '배달' : '포장 수령'} 완료된 주문입니다`,
            icon: '✓',
            tone: 'success' as const
          }
      : undefined;

  const footerSecondary = activeTab === 'new' ? '주문 반려' : undefined;
  const footerPrimary =
    activeTab === 'new'
      ? '주문 승인'
      : activeTab === 'cooking'
        ? '조리 완료'
        : activeTab === 'delivering' && order
          ? order.order_type === 'DELIVERY'
            ? '배달 완료'
            : '포장 수령 완료'
          : undefined;

  const handleFooterPrimary = (): void => {
    if (!order) return;
    if (activeTab === 'new') {
      setApproveOpen(true);
      return;
    }
    const next = nextStatusForTab(activeTab, order.order_type);
    if (next) {
      patchOrderStatus.mutate({
        orderId: order.id,
        request: { status: next, estimated_minutes: null, canceled_reason: null }
      });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#FBFAFC]">
      <Header
        storeName={STORE_NAME}
        onSettings={() => setSettingsOpen(true)}
        onEndBusiness={() => setEndBusinessOpen(true)}
      />

      <div className="flex-1 flex min-h-0">
        <div className="w-117.5 bg-white border-r border-border flex flex-col min-h-0 flex-none">
          <TabBar tabs={tabsWithCount} activeKey={activeTab} onChange={handleTabChange} />
          <div className="flex-1 overflow-y-auto">
            {deliveryRows.length > 0 && (
              <div>
                <SectionHeader
                  label={sectionLabel(activeTab, 'DELIVERY')}
                  count={deliveryRows.length}
                />
                {deliveryRows.map((row) => (
                  <OrderListItem
                    key={row.id}
                    no={row.order_number}
                    type={row.order_type === 'DELIVERY' ? '배달' : '포장'}
                    sub={rowSubLabel(row)}
                    selected={row.id === selectedId}
                    onClick={() => setManualSelectedId(row.id)}
                  />
                ))}
              </div>
            )}
            {takeoutRows.length > 0 && (
              <div>
                <SectionHeader
                  label={sectionLabel(activeTab, 'TAKE_OUT')}
                  count={takeoutRows.length}
                />
                {takeoutRows.map((row) => (
                  <OrderListItem
                    key={row.id}
                    no={row.order_number}
                    type={row.order_type === 'DELIVERY' ? '배달' : '포장'}
                    sub={rowSubLabel(row)}
                    selected={row.id === selectedId}
                    onClick={() => setManualSelectedId(row.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {order ? (
          <OrderDetail
            order={order}
            footerSecondary={footerSecondary}
            footerPrimary={footerPrimary}
            footerNote={footerNote}
            onFooterSecondary={() => setRejectOpen(true)}
            onFooterPrimary={handleFooterPrimary}
          />
        ) : (
          <div className="flex-1" />
        )}
      </div>

      <ApproveModal
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        onApprove={(minutes) => {
          if (!order) return;
          patchOrderStatus.mutate({
            orderId: order.id,
            request: { status: 'COOKING', estimated_minutes: minutes, canceled_reason: null }
          });
          setApproveOpen(false);
        }}
      />
      <RejectModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onReject={(reason) => {
          if (!order) return;
          patchOrderStatus.mutate({
            orderId: order.id,
            request: { status: 'CANCELED', estimated_minutes: null, canceled_reason: reason }
          });
          setRejectOpen(false);
        }}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        storeName={STORE_NAME}
      />
      <EndBusinessModal
        open={endBusinessOpen}
        onClose={() => setEndBusinessOpen(false)}
        onConfirm={() => {
          patchStoreStatus.mutate({ is_open: false });
          navigate('/stores');
        }}
      />
    </div>
  );
}
