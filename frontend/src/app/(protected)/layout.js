'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { PageSpinner } from '@/components/ui/PageSpinner';
import { useAuth } from '@/providers/AuthProvider';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing || !isAuthenticated) {
    return <PageSpinner />;
  }

  return children;
}
