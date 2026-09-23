import {
  Order,
  OrderMenu,
  OrderPayment,
  OrderReceiver,
  OrderStatusCounts,
  OrderTab
} from '../types/order'

export const orderTabs: OrderTab[] = [
  { key: 'new', label: '신규', statuses: ['CONFIRMING'] },
  { key: 'cooking', label: '조리중', statuses: ['COOKING'] },
  { key: 'delivering', label: '전달중', statuses: ['DELIVERING', 'PACKAGED'] },
  { key: 'done', label: '완료', statuses: ['DELIVERED', 'PICKED_UP', 'CANCELED'] }
]

export const mockOrderStatusCounts: OrderStatusCounts = {
  new_count: 3,
  cooking_count: 2,
  delivering_count: 1,
  completed_count: 12
}

const defaultMenus: OrderMenu[] = [
  {
    id: 1,
    menu_name: '짜장면',
    menu_price_name: '곱빼기',
    menu_price: 14000,
    quantity: 2,
    options: [
      { option_group_name: '추가 선택', option_name: '단무지 추가', option_price: 500, quantity: 1 }
    ]
  },
  {
    id: 2,
    menu_name: '탕수육(소)',
    menu_price_name: '기본',
    menu_price: 18000,
    quantity: 1,
    options: []
  }
]

const defaultReceiver: OrderReceiver = {
  name: '김민수',
  phone_number: '01012341234',
  address: '충청남도 천안시 동남구 병천면 충절로 1600',
  address_detail: '2공학관 201호',
  to_owner: '젓가락 2개 부탁드립니다',
  to_rider: '문 앞에 놔주세요',
  provide_cutlery: true
}

function buildPayment(menus: OrderMenu[], deliveryTip: number, discount = 0): OrderPayment {
  const totalProductPrice = menus.reduce((sum, menu) => {
    const optionsTotal = menu.options.reduce((s, o) => s + o.option_price * o.quantity, 0)
    return sum + menu.menu_price * menu.quantity + optionsTotal
  }, 0)

  return {
    method: 'CARD',
    approved_at: '',
    total_product_price: totalProductPrice,
    delivery_tip: deliveryTip,
    discount_amount: discount,
    total_price: totalProductPrice + deliveryTip - discount
  }
}

function iso(hour: number, minute: number): string {
  return new Date(2026, 8, 23, hour, minute).toISOString()
}

interface MockOrderInput {
  id: number
  order_number: string
  order_type: Order['order_type']
  order_status: Order['order_status']
  orderedAt: [number, number]
  completedAt?: [number, number]
  canceledAt?: [number, number]
  canceledReason?: string
}

function buildOrder(input: MockOrderInput): Order {
  const menus = defaultMenus
  const deliveryTip = input.order_type === 'DELIVERY' ? 3000 : 0
  const payment = buildPayment(menus, deliveryTip)
  const orderedAt = iso(...input.orderedAt)

  return {
    id: input.id,
    order_number: input.order_number,
    order_type: input.order_type,
    order_status: input.order_status,
    ordered_at: orderedAt,
    order_menus: menus,
    receiver: { ...defaultReceiver, provide_cutlery: input.order_type === 'DELIVERY' },
    payment: { ...payment, approved_at: orderedAt },
    completed_at: input.completedAt ? iso(...input.completedAt) : null,
    canceled_at: input.canceledAt ? iso(...input.canceledAt) : null,
    canceled_reason: input.canceledReason ?? null
  }
}

export const mockOrderList: Order[] = [
  buildOrder({
    id: 1,
    order_number: 'A-1042',
    order_type: 'DELIVERY',
    order_status: 'CONFIRMING',
    orderedAt: [18, 42]
  }),
  buildOrder({
    id: 2,
    order_number: 'A-1040',
    order_type: 'DELIVERY',
    order_status: 'CONFIRMING',
    orderedAt: [18, 38]
  }),
  buildOrder({
    id: 3,
    order_number: 'A-1041',
    order_type: 'TAKE_OUT',
    order_status: 'CONFIRMING',
    orderedAt: [18, 40]
  }),
  buildOrder({
    id: 4,
    order_number: 'A-1036',
    order_type: 'DELIVERY',
    order_status: 'COOKING',
    orderedAt: [18, 30]
  }),
  buildOrder({
    id: 5,
    order_number: 'A-1035',
    order_type: 'TAKE_OUT',
    order_status: 'COOKING',
    orderedAt: [18, 28]
  }),
  buildOrder({
    id: 6,
    order_number: 'A-1034',
    order_type: 'DELIVERY',
    order_status: 'DELIVERING',
    orderedAt: [18, 20]
  }),
  buildOrder({
    id: 7,
    order_number: 'A-1033',
    order_type: 'TAKE_OUT',
    order_status: 'PACKAGED',
    orderedAt: [18, 15]
  }),
  buildOrder({
    id: 8,
    order_number: 'A-1032',
    order_type: 'DELIVERY',
    order_status: 'DELIVERED',
    orderedAt: [18, 0],
    completedAt: [18, 25]
  }),
  buildOrder({
    id: 9,
    order_number: 'A-1031',
    order_type: 'TAKE_OUT',
    order_status: 'PICKED_UP',
    orderedAt: [17, 55],
    completedAt: [18, 10]
  }),
  buildOrder({
    id: 10,
    order_number: 'A-1030',
    order_type: 'DELIVERY',
    order_status: 'CANCELED',
    orderedAt: [17, 50],
    canceledAt: [17, 58],
    canceledReason: '재료 소진'
  })
]
