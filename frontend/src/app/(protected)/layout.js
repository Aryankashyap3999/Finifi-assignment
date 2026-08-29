'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { IconRail } from '@/components/layout/IconRail';
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <IconRail />
      <div className="flex-1">{children}</div>
    </div>
  );
}
