import { apiRequest, apiRequestBlob } from '@/lib/apiClient';

export const getDocuments = ({ token, type, poNumber }) => {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (poNumber) params.set('poNumber', poNumber);
  const query = params.toString();

  return apiRequest(`/documents${query ? `?${query}` : ''}`, { token });
};

export const uploadDocument = ({ token, documentType, file }) => {
  const formData = new FormData();
  formData.append('documentType', documentType);
  formData.append('file', file);

  return apiRequest('/documents/upload', {
    method: 'POST',
    token,
    body: formData,
    isFormData: true
  });
};

export const getDocumentFileBlob = ({ token, documentId }) =>
  apiRequestBlob(`/documents/${documentId}/file`, { token });
