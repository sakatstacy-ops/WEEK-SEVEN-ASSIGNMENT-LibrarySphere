const configuredApiBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE = (configuredApiBase || (import.meta.env.DEV ? '/api' : '')).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function api(path, options = {}) {
  if (!API_BASE) {
    throw new Error('VITE_API_BASE_URL must be configured with the deployed backend API URL.');
  }

  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('library-token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (response.status === 204) {
    return null;
  }

  const payload = await response.json();
  if (!response.ok) {
    throw new ApiError(payload.error || 'The request could not be completed.', response.status);
  }
  return payload;
}
