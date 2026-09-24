import { useQuery } from '@tanstack/react-query';
import { getOwnerShops } from './client';

export const useGetOwnerShops = () => {
  return useQuery({
    queryKey: ['shop', 'owner'],
    queryFn: () => getOwnerShops()
  });
};
