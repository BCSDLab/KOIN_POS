import { Store } from '../types/order'

export const stores: Store[] = [
  {
    id: 'sinjeon',
    name: '한끼반점 신전점',
    address: '천안시 동남구 병천면 충절로 1580',
    open: false
  },
  { id: 'dujeong', name: '한끼반점 두정점', address: '천안시 서북구 두정로 77', open: true },
  { id: 'buldang', name: '한끼반점 불당점', address: '천안시 서북구 불당25로 100', open: false }
]
