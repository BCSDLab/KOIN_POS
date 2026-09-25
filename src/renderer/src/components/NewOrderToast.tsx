import Badge from './ui/Badge';
import { formatTime } from '../lib/format';
import type { OrderList } from '@renderer/apis/order/entity';
import Logo from '../assets/Logo.svg';

interface SingleNewOrderToastProps {
  order: OrderList;
  onView: () => void;
  onClose: () => void;
}

export function SingleNewOrderToast({ order, onView, onClose }: SingleNewOrderToastProps) {
  return (
    <div className="w-110 bg-white rounded-2xl shadow-[0_18px_44px_rgba(70,20,100,0.2)] border border-border overflow-hidden flex">
      <div className="w-1.5 bg-primary flex-none" />
      <div className="flex-1 p-4.5 flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-subtle flex items-center justify-center flex-none text-2xl">
            <img src={Logo} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-xl font-extrabold text-ink">새 주문이 도착했어요</div>
            <div className="text-sm text-text-secondary font-semibold">
              방금 전 · {formatTime(order.ordered_at)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg text-text-tertiary flex-none"
          >
            ✕
          </button>
        </div>
        <div className="bg-surface rounded-xl px-4 py-3.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2.25">
            <span className="text-[21px] font-extrabold text-ink tabular-nums">
              {order.order_number}
            </span>
            <Badge variant={order.order_type === 'DELIVERY' ? 'subtle' : 'neutral'}>
              {order.order_type === 'DELIVERY' ? '배달' : '포장'}
            </Badge>
          </div>
          <div className="text-lg font-extrabold text-primary-ink tabular-nums">
            {order.total_price.toLocaleString()}원
          </div>
        </div>
        <button
          type="button"
          onClick={onView}
          className="h-14 rounded-xl bg-primary text-white text-lg font-extrabold shadow-[0_8px_20px_rgba(182,17,245,0.28)]"
        >
          주문 확인하기
        </button>
      </div>
    </div>
  );
}

interface MultiNewOrderToastProps {
  count: number;
  deliveryCount: number;
  takeoutCount: number;
  onView: () => void;
}

export function MultiNewOrderToast({
  count,
  deliveryCount,
  takeoutCount,
  onView
}: MultiNewOrderToastProps) {
  return (
    <div className="w-110 bg-white rounded-2xl shadow-[0_18px_44px_rgba(70,20,100,0.2)] border border-border overflow-hidden flex">
      <div className="w-1.5 bg-primary flex-none" />
      <div className="flex-1 p-4.5 flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-extrabold flex items-center justify-center flex-none tabular-nums">
            {count}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-xl font-extrabold text-ink">새 주문 {count}건이 도착했어요</div>
            <div className="text-sm text-text-secondary font-semibold">
              배달 {deliveryCount} · 포장 {takeoutCount}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onView}
          className="h-14 rounded-xl bg-primary text-white text-lg font-extrabold shadow-[0_8px_20px_rgba(182,17,245,0.28)]"
        >
          신규 주문 보기
        </button>
      </div>
    </div>
  );
}
