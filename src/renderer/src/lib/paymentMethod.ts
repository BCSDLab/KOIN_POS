import type { PaymentMethod } from '@renderer/apis/order/entity';

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  CARD: '카드',
  VIRTUAL_ACCOUNT: '가상계좌',
  EASY_PAY: '간편결제',
  MOBILE_PHONE: '휴대폰',
  ACCOUNT_TRANSFER: '계좌이체',
  CULTURE_GIFT_CERTIFICATE: '문화상품권',
  BOOK_CULTURE_GIFT_CERTIFICATE: '도서문화상품권',
  GAME_CULTURE_GIFT_CERTIFICATE: '게임문화상품권'
};
