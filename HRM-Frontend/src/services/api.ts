// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://heartratemonitor-1.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Adding Authorization header:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('No token found in localStorage');
    }
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const signup = (name: string, age: number, email: string, password: string) => {
  return api.post('/auth/signup', { name, age, email, password });
};

export const getRates = () => {
  return api.get('/rates');
};

export const addRate = (bpm: number) => {
  return api.post('/rates', { bpm });
};

export const getStats = () => {
  return api.get('/rates/stats');
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

export const testSecureEndpoint = () => {
  return api.get('/secure');
};

export default api;
