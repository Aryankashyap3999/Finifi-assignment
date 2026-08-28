import { apiRequest } from '@/lib/apiClient';

// Backend implements full email/password auth (see backend/src/routes/v1/users.js)
// rather than the assignment's minimal "POST /auth/login" — this calls the real,
// working endpoint.
export const login = ({ email, password }) =>
  apiRequest('/users/signin', { method: 'POST', body: { email, password } });
