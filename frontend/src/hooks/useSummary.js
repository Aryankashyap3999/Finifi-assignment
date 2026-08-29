'use client';

import { useQuery } from '@tanstack/react-query';

import { getSummary } from '@/lib/api/summaryApi';
import { useAuth } from '@/providers/AuthProvider';

export const useSummary = (poNumber) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['summary', poNumber],
    queryFn: () => getSummary({ token, poNumber }),
    enabled: Boolean(token) && Boolean(poNumber)
  });
};
