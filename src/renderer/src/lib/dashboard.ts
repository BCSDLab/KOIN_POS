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
