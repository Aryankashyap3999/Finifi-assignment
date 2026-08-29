import { apiRequest } from '@/lib/apiClient';

// Backend implements full email/password auth (see backend/src/routes/v1/users.js)
// rather than the assignment's minimal "POST /auth/login" — these call the real,
// working endpoints.
export const login = ({ email, password }) =>
  apiRequest('/users/signin', { method: 'POST', body: { email, password } });

export const signup = ({ email, username, password }) =>
  apiRequest('/users/signup', { method: 'POST', body: { email, username, password } });
