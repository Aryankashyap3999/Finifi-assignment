const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  constructor(message, statusCode, explanation) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.explanation = explanation;
  }
}

// Thin wrapper around fetch, aware of this backend's { success, message, err, data }
// response envelope. Framework-agnostic on purpose — no React here — so it stays
// reusable from any hook and testable on its own.
export const apiRequest = async (path, { method = 'GET', body, token, isFormData = false } = {}) => {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new ApiError(payload?.message || 'Something went wrong', response.status, payload?.err);
  }

  return payload.data;
};

// GET /documents/:id/file returns the raw file, not the { success, data } JSON
// envelope, so it needs its own path — still routed through the same base URL
// and auth header as apiRequest.
export const apiRequestBlob = async (path, { token } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { headers });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(payload?.message || 'Failed to load file', response.status, payload?.err);
  }

  return response.blob();
};
