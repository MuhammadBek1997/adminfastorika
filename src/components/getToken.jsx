// Returns only a token string by performing Fastorika-style login
// Uses hardcoded credentials requested by user

const API_BASE = import.meta.env?.VITE_API_URL || '';

export const getToken = async () => {
  const payload = {
    email: 'allayevmuhammad6@gmail.com',
    password: 'L12345678',
  };

  const res = await fetch(`${API_BASE}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error('Login response is not JSON');
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Login failed');
  }

  const token = data?.token;
  if (!token) {
    throw new Error('Token not found in response');
  }

  return token;
};

export default getToken;
