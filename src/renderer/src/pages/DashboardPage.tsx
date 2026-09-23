import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import TabBar from '../components/TabBar'
import SectionHeader from '../components/SectionHeader'
import OrderListItem from '../components/OrderListItem'
import Card from '../components/ui/Card'
import LabelValueRow from '../components/LabelValueRow'
import FooterBar from '../components/FooterBar'
import Button from '../components/ui/Button'
import ApproveModal from '../components/ApproveModal'
import RejectModal from '../components/RejectModal'
import SettingsModal from '../components/SettingsModal'
import EndBusinessModal from '../components/EndBusinessModal'
import { mockOrderList, mockOrderStatusCounts, orderTabs } from '../mock/orders'
import { Order, OrderStatusCounts, OrderType, PaymentMethod } from '../types/order'
import { formatDateTime, formatTime } from '../lib/format'

const countKeyByTab: Record<string, keyof OrderStatusCounts> = {
  new: 'new_count',
  cooking: 'cooking_count',
  delivering: 'delivering_count',
  done: 'completed_count'
}

const paymentMethodLabel: Record<PaymentMethod, string> = {
  CARD: '카드',
  VIRTUAL_ACCOUNT: '가상계좌',
  EASY_PAY: '간편결제',
  MOBILE_PHONE: '휴대폰',
  ACCOUNT_TRANSFER: '계좌이체',
  CULTURE_GIFT_CERTIFICATE: '문화상품권',
  BOOK_CULTURE_GIFT_CERTIFICATE: '도서문화상품권',
  GAME_CULTURE_GIFT_CERTIFICATE: '게임문화상품권'
}

function footerConfig(tabKey: string, order: Order): { secondary?: string; primary?: string } {
  if (tabKey === 'new') return { secondary: '주문 반려', primary: '주문 승인' }
  if (tabKey === 'cooking') return { primary: '조리 완료' }
  if (tabKey === 'delivering') {
    return { primary: order.order_type === 'DELIVERY' ? '배달 완료' : '포장 수령 완료' }
  }
  return {}
}

function sectionLabel(tabKey: string, type: OrderType): string {
  if (tabKey === 'delivering') {
    return type === 'DELIVERY' ? '배달중' : '포장완료 · 수령 대기'
  }
  return type === 'DELIVERY' ? '배달' : '포장'
}

function rowSubLabel(order: Order): string {
  if (order.order_status === 'CANCELED') {
    return `${formatTime(order.canceled_at!)} 반려, ${order.canceled_reason}`
  }
  if (order.order_status === 'DELIVERED') {
    return `${formatTime(order.completed_at!)} 배달 완료`
  }
  if (order.order_status === 'PICKED_UP') {
    return `${formatTime(order.completed_at!)} 포장 수령 완료`
  }
  return `${formatTime(order.ordered_at)} 접수`
}

const STORE_NAME = '한끼반점 신전점'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('new')
  const [selectedNumber, setSelectedNumber] = useState(
    mockOrderList.find((o) => o.order_status === 'CONFIRMING')!.order_number
  )
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [endBusinessOpen, setEndBusinessOpen] = useState(false)

  const activeTabDef = orderTabs.find((t) => t.key === activeTab)!
  const ordersInTab = mockOrderList.filter((o) => activeTabDef.statuses.includes(o.order_status))
  const deliveryRows = ordersInTab.filter((o) => o.order_type === 'DELIVERY')
  const takeoutRows = ordersInTab.filter((o) => o.order_type === 'TAKE_OUT')

  const order = mockOrderList.find((o) => o.order_number === selectedNumber) ?? ordersInTab[0]

  const handleTabChange = (key: string): void => {
    const nextTabDef = orderTabs.find((t) => t.key === key)!
    const firstOrder = mockOrderList.find((o) => nextTabDef.statuses.includes(o.order_status))
    setActiveTab(key)
    if (firstOrder) setSelectedNumber(firstOrder.order_number)
  }

  const tabsWithCount = orderTabs.map((tab) => ({
    ...tab,
    count: tab.key === 'done' ? null : mockOrderStatusCounts[countKeyByTab[tab.key]]
  }))

  const isRejected = order.order_status === 'CANCELED'
  const footerNote =
    activeTab === 'done'
      ? isRejected
        ? {
            label: `${formatTime(order.canceled_at!)} 반려된 주문입니다`,
            icon: '✕',
            tone: 'muted' as const
          }
        : {
            label: `${formatTime(order.completed_at!)} ${order.order_status === 'DELIVERED' ? '배달' : '포장 수령'} 완료된 주문입니다`,
            icon: '✓',
            tone: 'success' as const
          }
      : undefined

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
                    key={row.order_number}
                    no={row.order_number}
                    type={row.order_type === 'DELIVERY' ? '배달' : '포장'}
                    sub={rowSubLabel(row)}
                    selected={row.order_number === selectedNumber}
                    onClick={() => setSelectedNumber(row.order_number)}
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
                    key={row.order_number}
                    no={row.order_number}
                    type={row.order_type === 'DELIVERY' ? '배달' : '포장'}
                    sub={rowSubLabel(row)}
                    selected={row.order_number === selectedNumber}
                    onClick={() => setSelectedNumber(row.order_number)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
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
                const optionsTotal = menu.options.reduce(
                  (s, o) => s + o.option_price * o.quantity,
                  0
                )
                const lineTotal = menu.menu_price * menu.quantity + optionsTotal
                const optionText = [menu.menu_price_name, ...menu.options.map((o) => o.option_name)]
                  .filter(Boolean)
                  .join(', ')
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
                    {i < order.order_menus.length - 1 && (
                      <div className="h-px bg-[#F4F0F7] my-2.5" />
                    )}
                  </div>
                )
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
            secondary={footerConfig(activeTab, order).secondary}
            primary={footerConfig(activeTab, order).primary}
            note={footerNote}
            onSecondary={() => setRejectOpen(true)}
            onPrimary={() => {
              if (activeTab === 'new') setApproveOpen(true)
            }}
          />
        </div>
      </div>

      <ApproveModal
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        onApprove={() => setApproveOpen(false)}
      />
      <RejectModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onReject={() => setRejectOpen(false)}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        storeName={STORE_NAME}
      />
      <EndBusinessModal
        open={endBusinessOpen}
        onClose={() => setEndBusinessOpen(false)}
        onConfirm={() => navigate('/stores')}
      />
    </div>
  )
}
