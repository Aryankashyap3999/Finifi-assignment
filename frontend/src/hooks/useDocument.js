'use client';

import { useQuery } from '@tanstack/react-query';

import { getDocumentById } from '@/lib/api/documentsApi';
import { useAuth } from '@/providers/AuthProvider';

export const useDocument = (documentId) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocumentById({ token, documentId }),
    enabled: Boolean(token) && Boolean(documentId)
  });
};
