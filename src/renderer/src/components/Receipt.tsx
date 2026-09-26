import type { OrderDetail } from '@renderer/apis/order/entity';
import { formatDateTime, formatPhoneNumber } from '../lib/format';
import { paymentMethodLabel } from '../lib/paymentMethod';
import { receiptStyles } from '../lib/receiptStyles';

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={bold ? 'row row-bold' : 'row'}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function AmountRows({ order }: { order: OrderDetail }) {
  return (
    <>
      <Row label="상품 금액" value={`${order.payment.total_product_price.toLocaleString()}원`} />
      {order.order_type === 'DELIVERY' && (
        <Row label="배달비" value={`${order.payment.delivery_tip.toLocaleString()}원`} />
      )}
      <Row label="할인" value={`${order.payment.discount_amount.toLocaleString()}원`} />
    </>
  );
}

function MenuList({ order }: { order: OrderDetail }) {
  return (
    <>
      {order.order_menus.map((menu) => (
        <div key={menu.id}>
          <Row
            label={`${menu.menu_name} · ${menu.menu_price_name} × ${menu.quantity}`}
            value={`${(menu.menu_price * menu.quantity).toLocaleString()}원`}
          />
          {menu.options.map((option, i) => (
            <Row
              key={i}
              label={`  - ${option.option_name} × ${option.quantity}`}
              value={`${(option.option_price * option.quantity).toLocaleString()}원`}
            />
          ))}
        </div>
      ))}
    </>
  );
}

interface ReceiptProps {
  order: OrderDetail;
  storeName: string;
  type: 'store' | 'customer';
}

export default function Receipt({ order, storeName, type }: ReceiptProps) {
  const typeLabel = order.order_type === 'DELIVERY' ? '배달' : '포장';

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <style>{receiptStyles}</style>
      </head>
      <body>
        <div className="center">
          <div className="brand">KOIN</div>
          <div className="subtitle">
            {type === 'store' ? '매장용 주문 영수증' : '고객용 주문 영수증'}
          </div>
        </div>
        <div className="divider" />

        <div className="badge-row">
          <span>{typeLabel}</span>
          <span>#{order.order_number}</span>
        </div>
        <Row label="가게" value={storeName} />
        <Row label="주문" value={formatDateTime(order.ordered_at)} />
        <div className="divider" />

        <div className="section-title">주문 메뉴</div>
        <MenuList order={order} />
        <div className="divider" />

        {type === 'store' ? (
          <>
            {order.receiver.to_owner && (
              <>
                <div className="section-title">사장님 요청</div>
                <div className="plain-text">{order.receiver.to_owner}</div>
              </>
            )}
            <Row label="수저" value={order.receiver.provide_cutlery ? '제공' : '제공 안 함'} />
            <div className="divider" />
            <Row label="받는 분" value={order.receiver.name} />
            <Row label="연락처" value={formatPhoneNumber(order.receiver.phone_number)} />
            {order.order_type === 'DELIVERY' && (
              <>
                <div className="section-title">배달 주소</div>
                <div className="plain-text">{order.receiver.address}</div>
                <div className="plain-text">{order.receiver.address_detail}</div>
                {order.receiver.to_rider && (
                  <>
                    <div className="section-title">기사님 요청</div>
                    <div className="plain-text">{order.receiver.to_rider}</div>
                  </>
                )}
              </>
            )}
            <div className="divider" />
            <AmountRows order={order} />
            <div className="divider-bold" />
            <Row label="결제 완료" value={`${order.payment.total_price.toLocaleString()}원`} bold />
          </>
        ) : (
          <>
            <AmountRows order={order} />
            <div className="divider-bold" />
            <Row label="결제 완료" value={`${order.payment.total_price.toLocaleString()}원`} bold />
            <Row
              label="결제 수단"
              value={paymentMethodLabel[order.payment.method] ?? order.payment.method}
            />
            <div className="divider" />
            <Row label="받는 분" value={order.receiver.name} />
            <Row label="연락처" value={formatPhoneNumber(order.receiver.phone_number)} />
          </>
        )}
      </body>
    </html>
  );
}
