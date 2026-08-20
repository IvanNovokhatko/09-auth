import axios from 'axios';

const getBaseURL = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  if (typeof window !== 'undefined') {
    return configuredUrl ? `${configuredUrl}/api` : '/api';
  }

  return configuredUrl ? `${configuredUrl}/api` : 'https://notehub-api.goit.study/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

export default api;
