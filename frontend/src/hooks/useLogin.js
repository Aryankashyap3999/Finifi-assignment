'use client';

import { useMutation } from '@tanstack/react-query';

import { login } from '@/lib/api/authApi';
import { useAuth } from '@/providers/AuthProvider';

export const useLogin = () => {
  const { setToken } = useAuth();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => setToken(data.token)
  });
};
