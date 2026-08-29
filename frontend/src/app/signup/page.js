'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { PageSpinner } from '@/components/ui/PageSpinner';
import { useSignup } from '@/hooks/useSignup';
import { useAuth } from '@/providers/AuthProvider';

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const signupMutation = useSignup();

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
    signupMutation.mutate(
      {
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password')
      },
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
          <p className="mt-1 text-sm text-slate-500">Create your account</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Username" htmlFor="username">
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="janedoe"
                required
                minLength={3}
                pattern="[a-zA-Z0-9]+"
                title="Letters and numbers only, at least 3 characters"
                autoComplete="username"
              />
            </Field>
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
                autoComplete="new-password"
              />
            </Field>

            {signupMutation.isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {signupMutation.error.message}
              </div>
            )}

            <Button type="submit" isLoading={signupMutation.isPending} className="w-full">
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-slate-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
