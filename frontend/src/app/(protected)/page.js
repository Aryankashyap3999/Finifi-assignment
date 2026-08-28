'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">You&apos;re signed in</h1>
        <p className="mt-1 text-sm text-slate-500">
          The Purchase Order, Fulfillment, Delivery, and Summary views land here next.
        </p>
      </div>
      <Button variant="secondary" onClick={logout}>
        Log out
      </Button>
    </div>
  );
}
