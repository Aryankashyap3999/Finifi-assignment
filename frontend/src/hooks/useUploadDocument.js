'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadDocument } from '@/lib/api/documentsApi';
import { useAuth } from '@/providers/AuthProvider';

export const useUploadDocument = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentType, file }) => uploadDocument({ token, documentType, file }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['match'] });
    }
  });
};
