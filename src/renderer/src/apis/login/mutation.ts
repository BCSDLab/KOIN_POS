import { useMutation } from '@tanstack/react-query';
import type { OwnerLoginRequest, OwnerLoginResponse } from './entity';
import { ownerLogin } from './client';

export const usePostOwnerLogin = () => {
  return useMutation({
    mutationFn: (request: OwnerLoginRequest) => {
      return ownerLogin(request);
    },
    onSuccess: (response: OwnerLoginResponse) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refresh-token', response.refresh_token);
    }
  });
};
