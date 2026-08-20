import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }

  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  return configuredUrl ? `${configuredUrl}/api` : 'https://notehub-api.goit.study/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

export default api;
