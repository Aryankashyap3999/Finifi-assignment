'use client';

import { useMutation } from '@tanstack/react-query';

import { login, signup } from '@/lib/api/authApi';
import { useAuth } from '@/providers/AuthProvider';

// Signup itself returns no token (see backend/src/services/userService.js), so
// this chains straight into a sign-in on success rather than making the user
// submit their credentials twice.
export const useSignup = () => {
  const { setToken } = useAuth();

  return useMutation({
    mutationFn: async (credentials) => {
      await signup(credentials);
      return login({ email: credentials.email, password: credentials.password });
    },
    onSuccess: (data) => setToken(data.token)
  });
};
