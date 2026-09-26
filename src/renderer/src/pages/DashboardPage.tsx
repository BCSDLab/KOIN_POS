import { useReducer, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import OrderListPanel from '../components/OrderListPanel';
import OrderDetailPanel from '../components/OrderDetailPanel';
import DashboardModals from '../components/DashboardModals';
import { useGetOrderCount, useGetOrderDetail, useGetOrderList } from '@renderer/apis/order/queries';
import { usePatchOrderStatus, usePatchStoreStatus } from '@renderer/apis/order/mutation';
import { useGetOwnerShops } from '@renderer/apis/store/queries';
import { useNewOrderNotification } from '../hooks/useNewOrderNotification';
import {
  tabs,
  statusKey,
  countKey,
  nextStatusForTab,
  footerNoteForOrder,
  modalReducer
} from '../lib/dashboard';
import type { TabKey } from '../lib/dashboard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderableShopId = Number(searchParams.get('shopId'));

  const [activeTab, setActiveTab] = useState<TabKey>('new');
  const [manualSelectedId, setManualSelectedId] = useState<number | null>(null);
  const [modalState, dispatchModal] = useReducer(modalReducer, { modal: null });

  const ownerShops = useGetOwnerShops();
  const orderListRes = useGetOrderList(orderableShopId, statusKey[activeTab]);
  const countRes = useGetOrderCount(orderableShopId);
  const selectedId = manualSelectedId ?? orderListRes.data?.orders[0]?.id ?? null;
  const orderDetailRes = useGetOrderDetail(orderableShopId, selectedId);
  const patchOrderStatus = usePatchOrderStatus(orderableShopId);
  const patchStoreStatus = usePatchStoreStatus(orderableShopId);

  const currentShop = ownerShops.data?.shops.find(
    (shop) => shop.orderable_shop_id === orderableShopId
  );
  const counts = countRes.data;
  const order = orderDetailRes.data;
  const isOrderDetailOffline = orderDetailRes.fetchStatus === 'paused';

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

  const handleTabChange = (key: string): void => {
    setActiveTab(key as TabKey);
    setManualSelectedId(null);
  };

  const handleFooterPrimary = (): void => {
    if (!order) return;
    if (activeTab === 'new') {
      dispatchModal({ type: 'OPEN_APPROVE' });
      return;
    }
    const next = nextStatusForTab(activeTab, order.order_type);
    if (next) {
      dispatchModal({ type: 'REQUEST_NEXT_STATUS_CONFIRM', status: next });
    }
  };

  const handleApproveMinutesSelected = (minutes: number): void => {
    dispatchModal({ type: 'REQUEST_APPROVE_CONFIRM', minutes });
  };

  const handleConfirmPendingAction = (): void => {
    if (!order || modalState.modal !== 'Confirm') return;
    const { pendingAction } = modalState;
    if (pendingAction.type === 'approve') {
      patchOrderStatus.mutate(
        {
          orderId: order.id,
          request: {
            status: 'COOKING',
            estimated_minutes: pendingAction.minutes,
            canceled_reason: null
          }
        },
        { onSuccess: () => dispatchModal({ type: 'CLOSE' }) }
      );
    } else {
      patchOrderStatus.mutate(
        {
          orderId: order.id,
          request: { status: pendingAction.status, estimated_minutes: null, canceled_reason: null }
        },
        { onSuccess: () => dispatchModal({ type: 'CLOSE' }) }
      );
    }
  };

  const handleReject = (reason: string): void => {
    if (!order) return;
    patchOrderStatus.mutate({
      orderId: order.id,
      request: { status: 'CANCELED', estimated_minutes: null, canceled_reason: reason }
    });
    dispatchModal({ type: 'CLOSE' });
  };

  const handleEndBusiness = (): void => {
    patchStoreStatus.mutate({ is_open: false });
    navigate('/stores');
  };

  useNewOrderNotification(orderableShopId, (orderId) => {
    setActiveTab('new');
    if (orderId !== undefined) setManualSelectedId(orderId);
  });

  return (
    <div className="w-full h-screen flex flex-col bg-[#FBFAFC]">
      <Header
        storeName={currentShop?.name}
        onSettings={() => dispatchModal({ type: 'OPEN_SETTING' })}
        onEndBusiness={() => dispatchModal({ type: 'OPEN_END_BUSINESS' })}
      />

      <div className="flex-1 flex min-h-0">
        <div className="w-117.5 bg-white border-r border-border flex flex-col min-h-0 flex-none">
          <TabBar tabs={tabsWithCount} activeKey={activeTab} onChange={handleTabChange} />
          <div className="flex-1 overflow-y-auto">
            <OrderListPanel
              orderableShopId={orderableShopId}
              activeTab={activeTab}
              selectedId={selectedId}
              onSelect={setManualSelectedId}
            />
          </div>
        </div>

        <OrderDetailPanel
          selectedId={selectedId}
          isPending={orderDetailRes.isPending}
          isError={orderDetailRes.isError}
          isOffline={isOrderDetailOffline}
          errorMessage={orderDetailRes.error?.message}
          onRetry={() => orderDetailRes.refetch()}
          order={order}
          footerSecondary={footerSecondary}
          footerPrimary={footerPrimary}
          footerNote={footerNote}
          onFooterSecondary={() => dispatchModal({ type: 'OPEN_REJECT' })}
          onFooterPrimary={handleFooterPrimary}
        />
      </div>

      <DashboardModals
        activeModal={modalState.modal}
        onClose={() => dispatchModal({ type: 'CLOSE' })}
        storeName={currentShop?.name}
        onApproveMinutesSelected={handleApproveMinutesSelected}
        onReject={handleReject}
        onEndBusiness={handleEndBusiness}
        confirmMessage={`${footerPrimary ?? '이 작업을'} 처리하시겠습니까?`}
        onConfirm={handleConfirmPendingAction}
        isConfirmPending={patchOrderStatus.isPending}
      />
    </div>
  );
}
