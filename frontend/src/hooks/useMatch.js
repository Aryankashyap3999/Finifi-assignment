'use client';

import { useQuery } from '@tanstack/react-query';

import { getMatch } from '@/lib/api/matchApi';
import { useAuth } from '@/providers/AuthProvider';

export const useMatch = (poNumber) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['match', poNumber],
    queryFn: () => getMatch({ token, poNumber }),
    enabled: Boolean(token) && Boolean(poNumber)
  });
};
