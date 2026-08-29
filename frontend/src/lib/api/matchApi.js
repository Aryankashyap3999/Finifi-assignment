import { apiRequest } from '@/lib/apiClient';

export const getMatch = ({ token, poNumber }) =>
  apiRequest(`/match/${encodeURIComponent(poNumber)}`, { token });
