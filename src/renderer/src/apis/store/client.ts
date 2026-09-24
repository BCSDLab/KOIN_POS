import { apiClient } from '../apiClient';
import type { OwnerShopsResponse } from './entity';

export const getOwnerShops = () =>
  apiClient.get<OwnerShopsResponse>('/owner/order/shops', { authorization: true });
