import type { ORDER_STATUS, ORDER_TYPE, OrderList, OrderDetail } from '@renderer/apis/order/entity';
import { formatTime } from './format';

export type TabKey = 'new' | 'cooking' | 'delivering' | 'done';
export type ServerStatus = 'NEW' | 'COOKING' | 'DELIVERING' | 'COMPLETED';

export const tabs: { key: TabKey; label: string }[] = [
  { key: 'new', label: '신규' },
  { key: 'cooking', label: '조리중' },
  { key: 'delivering', label: '전달중' },
  { key: 'done', label: '완료' }
];

export const statusKey: Record<TabKey, ServerStatus> = {
  new: 'NEW',
  cooking: 'COOKING',
  delivering: 'DELIVERING',
  done: 'COMPLETED'
};

export const countKey: Record<TabKey, 'new_count' | 'cooking_count' | 'delivering_count' | null> = {
  new: 'new_count',
  cooking: 'cooking_count',
  delivering: 'delivering_count',
  done: null
};

export function sectionLabel(tabKey: TabKey, type: ORDER_TYPE): string {
  if (tabKey === 'delivering') {
    return type === 'DELIVERY' ? '배달중' : '포장완료 · 수령 대기';
  }
  return type === 'DELIVERY' ? '배달' : '포장';
}

export function rowSubLabel(order: OrderList): string {
  if (order.order_status === 'CANCELED') return '반려';
  if (order.order_status === 'DELIVERED') return `${formatTime(order.estimated_at)} 배달 완료`;
  if (order.order_status === 'PICKED_UP') return `${formatTime(order.estimated_at)} 포장 수령 완료`;
  if (order.order_status === 'CONFIRMING') return `${formatTime(order.ordered_at)} 접수`;
  return `${formatTime(order.estimated_at)} 완료 예정`;
}

export function nextStatusForTab(tabKey: TabKey, orderType: ORDER_TYPE): ORDER_STATUS | null {
  if (tabKey === 'cooking') return orderType === 'DELIVERY' ? 'DELIVERING' : 'PACKAGED';
  if (tabKey === 'delivering') return orderType === 'DELIVERY' ? 'DELIVERED' : 'PICKED_UP';
  return null;
}

export function footerNoteForOrder(order: OrderDetail): {
  label: string;
  icon: string;
  tone: 'success' | 'muted';
} {
  if (order.order_status === 'CANCELED') {
    return { label: '반려된 주문입니다', icon: '✕', tone: 'muted' };
  }
  return {
    label: `${order.order_status === 'DELIVERED' ? '배달' : '포장 수령'} 완료된 주문입니다`,
    icon: '✓',
    tone: 'success'
  };
}

export type PendingAction =
  { type: 'approve'; minutes: number } | { type: 'nextStatus'; status: ORDER_STATUS };

export type ModalState =
  | { modal: null }
  | { modal: 'Approve' }
  | { modal: 'Reject' }
  | { modal: 'Setting' }
  | { modal: 'EndBusiness' }
  | { modal: 'Confirm'; pendingAction: PendingAction };

export type ModalAction =
  | { type: 'OPEN_APPROVE' }
  | { type: 'OPEN_REJECT' }
  | { type: 'OPEN_SETTING' }
  | { type: 'OPEN_END_BUSINESS' }
  | { type: 'REQUEST_APPROVE_CONFIRM'; minutes: number }
  | { type: 'REQUEST_NEXT_STATUS_CONFIRM'; status: ORDER_STATUS }
  | { type: 'CLOSE' };

export function modalReducer(_state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'OPEN_APPROVE':
      return { modal: 'Approve' };
    case 'OPEN_REJECT':
      return { modal: 'Reject' };
    case 'OPEN_SETTING':
      return { modal: 'Setting' };
    case 'OPEN_END_BUSINESS':
      return { modal: 'EndBusiness' };
    case 'REQUEST_APPROVE_CONFIRM':
      return { modal: 'Confirm', pendingAction: { type: 'approve', minutes: action.minutes } };
    case 'REQUEST_NEXT_STATUS_CONFIRM':
      return { modal: 'Confirm', pendingAction: { type: 'nextStatus', status: action.status } };
    case 'CLOSE':
      return { modal: null };
  }
}
