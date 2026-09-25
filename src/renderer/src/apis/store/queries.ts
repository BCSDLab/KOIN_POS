import { useQuery } from '@tanstack/react-query';
import { getOwnerShops } from './client';

export const useGetOwnerShops = () => {
  return useQuery({
    queryKey: ['owner', 'shops'],
    queryFn: () => getOwnerShops()
  });
};
