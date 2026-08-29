'use client';

import { useQuery } from '@tanstack/react-query';

import { getDocuments } from '@/lib/api/documentsApi';
import { useAuth } from '@/providers/AuthProvider';

export const useDocuments = ({ type, poNumber } = {}) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['documents', { type, poNumber }],
    queryFn: () => getDocuments({ token, type, poNumber }),
    enabled: Boolean(token)
  });
};
