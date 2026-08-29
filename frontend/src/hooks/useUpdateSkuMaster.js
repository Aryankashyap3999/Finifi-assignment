'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateSkuMaster } from '@/lib/api/skuMasterApi';
import { useAuth } from '@/providers/AuthProvider';

export const useUpdateSkuMaster = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSkuMaster({ token, id, data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skuMasters'] })
  });
};
