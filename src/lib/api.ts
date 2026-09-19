const AUTH_TOKEN_KEY = 'pfa_auth_token';

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const saveAuthToken = (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token);

export const clearAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

export const apiFetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = new Headers(init.headers);

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, { ...init, headers });
};
