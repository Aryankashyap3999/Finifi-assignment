'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteSkuMaster } from '@/lib/api/skuMasterApi';
import { useAuth } from '@/providers/AuthProvider';

export const useDeleteSkuMaster = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteSkuMaster({ token, id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skuMasters'] })
  });
};
