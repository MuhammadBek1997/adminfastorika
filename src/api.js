export const API_BASE = import.meta.env.VITE_API_URL || 'http://backend-fastorika.up.railway.app/api/';

export const apiFetch = async (path, options = {}) => {
  const defaultHeaders = {
    Accept: 'application/json',
  };
  const token = typeof window !== 'undefined' ? (sessionStorage.getItem('token') || localStorage.getItem('token')) : null;
  const envAuth = import.meta.env.VITE_API_AUTH;
  if (!options.headers?.Authorization) {
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else if (envAuth) {
      defaultHeaders['Authorization'] = envAuth;
    }
  }

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  return fetch(`${API_BASE}${path}`, mergedOptions);
};

export const fetchUsers = async (page = 0, size = 10) => {
  const res = await apiFetch(`admin/users?page=${page}&size=${size}`, { method: 'GET' });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Failed to load users');
  }
  const normalized = Array.isArray(data) ? data : (data?.content ?? data?.items ?? data?.results ?? []);
  return normalized;
};
