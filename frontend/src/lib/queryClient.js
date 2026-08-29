import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/apiClient';
import { TOKEN_STORAGE_KEY } from '@/providers/AuthProvider';

const PUBLIC_PATHS = new Set(['/login', '/signup']);

// A token going stale (expired, or the backend restarted with a different
// JWT_SECRET) previously surfaced as a raw "Authentication required" error
// inline on whatever page was open, instead of sending the user back to
// login. Any 401 from any query or mutation now clears the token and bounces
// to /login instead.
const handleUnauthorized = (error) => {
  if (!(error instanceof ApiError) || error.statusCode !== 401) return;
  if (typeof window === 'undefined' || PUBLIC_PATHS.has(window.location.pathname)) return;

  localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.location.href = '/login';
};

const skipRetryOn401 = (failureCount, error) => {
  if (error instanceof ApiError && error.statusCode === 401) return false;
  return failureCount < 1;
};

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({ onError: handleUnauthorized }),
    mutationCache: new MutationCache({ onError: handleUnauthorized }),
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: skipRetryOn401
      }
    }
  });
