import axios from 'axios';

const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:8001/api' 
  : '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?error=Session expired. Please log in again.';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
