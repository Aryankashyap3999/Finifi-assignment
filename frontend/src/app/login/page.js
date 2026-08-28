'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { PageSpinner } from '@/components/ui/PageSpinner';
import { useLogin } from '@/hooks/useLogin';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const loginMutation = useLogin();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace('/');
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing || isAuthenticated) {
    return <PageSpinner />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    loginMutation.mutate(
      { email: formData.get('email'), password: formData.get('password') },
      { onSuccess: () => router.replace('/') }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            3W
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Three-Way Match Engine</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </Field>

            {loginMutation.isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {loginMutation.error.message}
              </div>
            )}

            <Button type="submit" isLoading={loginMutation.isPending} className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
