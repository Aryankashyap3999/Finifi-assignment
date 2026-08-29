import { apiRequest } from '@/lib/apiClient';

export const getSkuMasters = ({ token }) => apiRequest('/masters/sku', { token });

export const createSkuMaster = ({ token, data }) =>
  apiRequest('/masters/sku', { method: 'POST', token, body: data });

export const updateSkuMaster = ({ token, id, data }) =>
  apiRequest(`/masters/sku/${id}`, { method: 'PATCH', token, body: data });

export const deleteSkuMaster = ({ token, id }) =>
  apiRequest(`/masters/sku/${id}`, { method: 'DELETE', token });
