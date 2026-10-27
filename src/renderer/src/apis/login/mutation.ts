import { useMutation } from '@tanstack/react-query';
import type { OwnerLoginRequest, OwnerLoginResponse } from './entity';
import { ownerLogin } from './client';
import { setTokens } from '../apiClient';

export const usePostOwnerLogin = () => {
  return useMutation({
    mutationFn: (request: OwnerLoginRequest) => {
      return ownerLogin(request);
    },
    onSuccess: (response: OwnerLoginResponse) => {
      setTokens(response.token, response.refresh_token);
    }
  });
};
