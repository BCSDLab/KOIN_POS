import { apiClient } from '../apiClient';
import type { OwnerLoginRequest, OwnerLoginResponse } from './entity';

export const ownerLogin = (request: OwnerLoginRequest) =>
  apiClient.post<OwnerLoginResponse, OwnerLoginRequest>('/owner/login', request);
