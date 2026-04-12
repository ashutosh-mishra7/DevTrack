import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://devtrack-nd76.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  // ✅ Cache bust
  config.headers['Cache-Control'] = 'no-cache';
  config.params = { ...config.params, _t: Date.now() };
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;