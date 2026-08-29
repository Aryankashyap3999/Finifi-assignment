import { apiRequest } from '@/lib/apiClient';

export const getSummary = ({ token, poNumber }) =>
  apiRequest(`/summary/${encodeURIComponent(poNumber)}`, { token });
