'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSkuMaster } from '@/lib/api/skuMasterApi';
import { useAuth } from '@/providers/AuthProvider';

export const useCreateSkuMaster = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createSkuMaster({ token, data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skuMasters'] })
  });
};
