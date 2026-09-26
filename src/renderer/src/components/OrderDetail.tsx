import { buildReceiptHtml } from '@renderer/lib/receipt';
import Card from './ui/Card';
import Button from './ui/Button';
import LabelValueRow from './LabelValueRow';
import FooterBar from './FooterBar';
import { formatDateTime } from '../lib/format';
import { paymentMethodLabel } from '../lib/paymentMethod';
import type { OrderDetail as OrderDetailData } from '../apis/order/entity';

export interface OrderDetailFooterNote {
  label: string;
  icon: string;
  tone: 'success' | 'muted';
}

interface OrderDetailProps {
  order: OrderDetailData;
  footerSecondary?: string;
  footerPrimary?: string;
  footerNote?: OrderDetailFooterNote;
  onFooterSecondary?: () => void;
  onFooterPrimary?: () => void;
  shopName: string;
}

export default function OrderDetail({
  order,
  footerSecondary,
  footerPrimary,
  footerNote,
  onFooterSecondary,
  onFooterPrimary,
  shopName
}: OrderDetailProps) {
  const isRejected = order.order_status === 'CANCELED';

  type Row = { label: string; value: React.ReactNode };
  const isRow = (row: Row | null): row is Row => row !== null;

  const receiverRows = (
    [
      { label: '주문 유형', value: order.order_type === 'DELIVERY' ? '배달' : '포장' },
      { label: '수저 제공', value: order.receiver.provide_cutlery ? 'Y' : 'N' },
      { label: '받는사람', value: order.receiver.name },
      { label: '연락처', value: order.receiver.phone_number },
      { label: '받는주소', value: `${order.receiver.address} ${order.receiver.address_detail}` },
      { label: '사장님에게', value: order.receiver.to_owner },
      order.order_type === 'DELIVERY'
        ? { label: '배달기사님에게', value: order.receiver.to_rider }
        : null
    ] as (Row | null)[]
  ).filter(isRow);

  const paymentRows = (
    [
      {
        label: '결제수단',
        value: paymentMethodLabel[order.payment.method] ?? order.payment.method
      },
      { label: '결제 일시', value: formatDateTime(order.payment.approved_at) },
      isRejected
        ? null
        : { label: '상품 금액', value: `${order.payment.total_product_price.toLocaleString()}원` },
      isRejected || order.payment.delivery_tip <= 0
        ? null
        : { label: '배달비', value: `${order.payment.delivery_tip.toLocaleString()}원` },
      isRejected || order.payment.discount_amount <= 0
        ? null
        : { label: '할인 금액', value: `-${order.payment.discount_amount.toLocaleString()}원` }
    ] as (Row | null)[]
  ).filter(isRow);

  const handlePrint = async (): Promise<void> => {
    const storeHtml = buildReceiptHtml(order, shopName, 'store');
    const customerHtml = buildReceiptHtml(order, shopName, 'customer');
    await window.api.printReceipt(storeHtml);
    await window.api.printReceipt(customerHtml);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <div className="flex-1 overflow-y-auto px-8.5 py-6 flex flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="text-[30px] font-extrabold text-ink">주문상세</div>
            <div className="text-lg text-ink font-bold">
              {formatDateTime(order.ordered_at)} 접수
              <span className="text-text-secondary font-semibold ml-4">주문번호 </span>
              <span className="font-bold tabular-nums">{order.order_number}</span>
            </div>
          </div>
          {!isRejected && (
            <Button
              variant="outline"
              size="md"
              className="h-12.5 px-5 text-lg"
              onClick={handlePrint}
            >
              주문서 출력
            </Button>
          )}
        </div>

        <Card>
          <div className="text-[15px] font-extrabold text-primary-ink">주문 상품</div>
          {order.order_menus.map((menu, i) => {
            const optionsTotal = menu.options.reduce((s, o) => s + o.option_price * o.quantity, 0);
            const lineTotal = menu.menu_price * menu.quantity + optionsTotal;
            const optionText = [menu.menu_price_name, ...menu.options.map((o) => o.option_name)]
              .filter(Boolean)
              .join(', ');
            return (
              <div key={menu.id}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="text-xl font-bold text-ink">{menu.menu_name}</div>
                    <div className="text-base text-text-secondary">{optionText}</div>
                  </div>
                  <div className="text-lg text-ink font-bold tabular-nums">
                    {lineTotal.toLocaleString()}원
                    <span className="text-text-secondary font-semibold ml-2.5">
                      {menu.quantity}개
                    </span>
                  </div>
                </div>
                {i < order.order_menus.length - 1 && <div className="h-px bg-[#F4F0F7] my-2.5" />}
              </div>
            );
          })}
        </Card>

        <Card>
          <div className="text-[15px] font-extrabold text-primary-ink">받는사람 정보</div>
          {receiverRows.map((row) => (
            <LabelValueRow key={row.label} label={row.label}>
              {row.value}
            </LabelValueRow>
          ))}
        </Card>

        <Card>
          <div className="text-[15px] font-extrabold text-primary-ink">결제 정보</div>
          {paymentRows.map((row) => (
            <LabelValueRow key={row.label} label={row.label}>
              {row.value}
            </LabelValueRow>
          ))}
          <div className="h-px bg-[#F4F0F7]" />
          <div className="flex items-baseline">
            <div className="w-39.5 flex-none text-lg font-bold text-ink">
              {isRejected ? '총 취소금액' : '총 결제금액'}
            </div>
            <div className="text-2xl font-extrabold text-primary-ink tabular-nums">
              {order.payment.total_price.toLocaleString()}원
            </div>
          </div>
        </Card>

        {isRejected && (
          <Card className="bg-surface border-[#EAD6F6]">
            <div className="text-[15px] font-extrabold text-primary-ink">반려 정보</div>
            <LabelValueRow label="반려 사유">
              <span className="font-bold">{order.canceled_reason}</span>
            </LabelValueRow>
          </Card>
        )}
      </div>

      <FooterBar
        secondary={footerSecondary}
        primary={footerPrimary}
        note={footerNote}
        onSecondary={onFooterSecondary}
        onPrimary={onFooterPrimary}
      />
    </div>
  );
}
