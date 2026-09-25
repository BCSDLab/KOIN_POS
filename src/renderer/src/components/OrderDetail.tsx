import Card from './ui/Card';
import Button from './ui/Button';
import LabelValueRow from './LabelValueRow';
import FooterBar from './FooterBar';
import { formatDateTime } from '../lib/format';
import type { OrderDetail as OrderDetailData, PaymentMethod } from '../apis/order/entity';

const paymentMethodLabel: Record<PaymentMethod, string> = {
  CARD: '카드',
  VIRTUAL_ACCOUNT: '가상계좌',
  EASY_PAY: '간편결제',
  MOBILE_PHONE: '휴대폰',
  ACCOUNT_TRANSFER: '계좌이체',
  CULTURE_GIFT_CERTIFICATE: '문화상품권',
  BOOK_CULTURE_GIFT_CERTIFICATE: '도서문화상품권',
  GAME_CULTURE_GIFT_CERTIFICATE: '게임문화상품권'
};

interface OrderDetailFooterNote {
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
}

export default function OrderDetail({
  order,
  footerSecondary,
  footerPrimary,
  footerNote,
  onFooterSecondary,
  onFooterPrimary
}: OrderDetailProps) {
  const isRejected = order.order_status === 'CANCELED';

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
            <Button variant="outline" size="md" className="h-12.5 px-5 text-lg">
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
          <LabelValueRow label="주문 유형">
            {order.order_type === 'DELIVERY' ? '배달' : '포장'}
          </LabelValueRow>
          <LabelValueRow label="수저 제공">
            {order.receiver.provide_cutlery ? 'Y' : 'N'}
          </LabelValueRow>
          <LabelValueRow label="받는사람">{order.receiver.name}</LabelValueRow>
          <LabelValueRow label="연락처">{order.receiver.phone_number}</LabelValueRow>
          <LabelValueRow label="받는주소">
            {order.receiver.address} {order.receiver.address_detail}
          </LabelValueRow>
          <LabelValueRow label="사장님에게">{order.receiver.to_owner}</LabelValueRow>
          {order.order_type === 'DELIVERY' && (
            <LabelValueRow label="배달기사님에게">{order.receiver.to_rider}</LabelValueRow>
          )}
        </Card>

        <Card>
          <div className="text-[15px] font-extrabold text-primary-ink">결제 정보</div>
          <LabelValueRow label="결제수단">
            {paymentMethodLabel[order.payment.method] ?? order.payment.method}
          </LabelValueRow>
          <LabelValueRow label="결제 일시">
            {formatDateTime(order.payment.approved_at)}
          </LabelValueRow>
          {!isRejected && (
            <>
              <LabelValueRow label="상품 금액">
                {order.payment.total_product_price.toLocaleString()}원
              </LabelValueRow>
              {order.payment.delivery_tip > 0 && (
                <LabelValueRow label="배달비">
                  {order.payment.delivery_tip.toLocaleString()}원
                </LabelValueRow>
              )}
              {order.payment.discount_amount > 0 && (
                <LabelValueRow label="할인 금액">
                  -{order.payment.discount_amount.toLocaleString()}원
                </LabelValueRow>
              )}
            </>
          )}
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
