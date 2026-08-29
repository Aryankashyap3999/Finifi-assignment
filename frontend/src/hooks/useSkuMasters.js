'use client';

import { useQuery } from '@tanstack/react-query';

import { getSkuMasters } from '@/lib/api/skuMasterApi';
import { useAuth } from '@/providers/AuthProvider';

export const useSkuMasters = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['skuMasters'],
    queryFn: () => getSkuMasters({ token }),
    enabled: Boolean(token)
  });
};
