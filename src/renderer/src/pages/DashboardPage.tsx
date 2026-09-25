import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import SectionHeader from '../components/SectionHeader';
import OrderListItem from '../components/OrderListItem';
import OrderDetail from '../components/OrderDetail';
import QueryStateGate from '../components/QueryStateGate';
import ApproveModal from '../components/ApproveModal';
import RejectModal from '../components/RejectModal';
import SettingsModal from '../components/SettingsModal';
import EndBusinessModal from '../components/EndBusinessModal';
import { useGetOrderCount, useGetOrderDetail, useGetOrderList } from '@renderer/apis/order/queries';
import { usePatchOrderStatus, usePatchStoreStatus } from '@renderer/apis/order/mutation';
import { useGetOwnerShops } from '@renderer/apis/store/queries';
import {
  tabs,
  statusKey,
  countKey,
  sectionLabel,
  rowSubLabel,
  nextStatusForTab,
  footerNoteForOrder
} from '../lib/dashboard';
import type { TabKey } from '../lib/dashboard';

type ModalType = 'Approve' | 'Reject' | 'Setting' | 'EndBusiness' | null;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderableShopId = Number(searchParams.get('shopId'));

  const [activeTab, setActiveTab] = useState<TabKey>('new');
  const [manualSelectedId, setManualSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<ModalType>(null);

  const ownerShops = useGetOwnerShops();
  const currentShop = ownerShops.data?.shops.find(
    (shop) => shop.orderable_shop_id === orderableShopId
  );
  const orderListRes = useGetOrderList(orderableShopId, statusKey[activeTab]);
  const orderList = orderListRes.data?.orders ?? [];
  const isOrderListOffline = orderListRes.fetchStatus === 'paused';
  const deliveryRows = orderList.filter((o) => o.order_type === 'DELIVERY');
  const takeoutRows = orderList.filter((o) => o.order_type === 'TAKE_OUT');

  const countRes = useGetOrderCount(orderableShopId);
  const counts = countRes.data;

  const selectedId = manualSelectedId ?? orderList[0]?.id ?? null;
  const orderDetailRes = useGetOrderDetail(orderableShopId, selectedId);
  const order = orderDetailRes.data;
  const isOrderDetailOffline = orderDetailRes.fetchStatus === 'paused';

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

  const footerNote = activeTab === 'done' && order ? footerNoteForOrder(order) : undefined;

  const footerSecondary = activeTab === 'new' ? '주문 반려' : undefined;

  const footerPrimaryLabel: Partial<Record<TabKey, string>> = {
    new: '주문 승인',
    cooking: '조리 완료'
  };

  const footerPrimary =
    activeTab === 'delivering' && order
      ? order.order_type === 'DELIVERY'
        ? '배달 완료'
        : '포장 수령 완료'
      : footerPrimaryLabel[activeTab];

  const handleFooterPrimary = (): void => {
    if (!order) return;
    if (activeTab === 'new') {
      setIsModalOpen('Approve');
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
        storeName={currentShop?.name}
        onSettings={() => setIsModalOpen('Setting')}
        onEndBusiness={() => setIsModalOpen('EndBusiness')}
      />

      <div className="flex-1 flex min-h-0">
        <div className="w-117.5 bg-white border-r border-border flex flex-col min-h-0 flex-none">
          <TabBar tabs={tabsWithCount} activeKey={activeTab} onChange={handleTabChange} />
          <div className="flex-1 overflow-y-auto">
            <QueryStateGate
              isPending={orderListRes.isPending}
              isError={orderListRes.isError}
              isOffline={isOrderListOffline}
              length={orderList.length}
              errorMessage={orderListRes.error?.message}
              onRetry={() => orderListRes.refetch()}
            >
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
            </QueryStateGate>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {selectedId !== null && (
            <QueryStateGate
              isPending={orderDetailRes.isPending}
              isError={orderDetailRes.isError}
              isOffline={isOrderDetailOffline}
              length={order ? 1 : 0}
              errorMessage={orderDetailRes.error?.message}
              onRetry={() => orderDetailRes.refetch()}
            >
              {order && (
                <OrderDetail
                  order={order}
                  footerSecondary={footerSecondary}
                  footerPrimary={footerPrimary}
                  footerNote={footerNote}
                  onFooterSecondary={() => setIsModalOpen('Reject')}
                  onFooterPrimary={handleFooterPrimary}
                />
              )}
            </QueryStateGate>
          )}
        </div>
      </div>

      <ApproveModal
        open={isModalOpen === 'Approve'}
        onClose={() => setIsModalOpen(null)}
        onApprove={(minutes) => {
          if (!order) return;
          patchOrderStatus.mutate({
            orderId: order.id,
            request: { status: 'COOKING', estimated_minutes: minutes, canceled_reason: null }
          });
          setIsModalOpen(null);
        }}
      />
      <RejectModal
        open={isModalOpen === 'Reject'}
        onClose={() => setIsModalOpen(null)}
        onReject={(reason) => {
          if (!order) return;
          patchOrderStatus.mutate({
            orderId: order.id,
            request: { status: 'CANCELED', estimated_minutes: null, canceled_reason: reason }
          });
          setIsModalOpen(null);
        }}
      />
      <SettingsModal
        open={isModalOpen === 'Setting'}
        onClose={() => setIsModalOpen(null)}
        storeName={currentShop?.name}
      />
      <EndBusinessModal
        open={isModalOpen === 'EndBusiness'}
        onClose={() => setIsModalOpen(null)}
        onConfirm={() => {
          patchStoreStatus.mutate({ is_open: false });
          navigate('/stores');
        }}
      />
    </div>
  );
}
