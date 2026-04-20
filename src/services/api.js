import axios from 'axios';
import { getItem } from '../utils/storage';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response.data;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.status, error.config?.url);
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    }

    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

// HTTP method wrappers
export const get = (url, config = {}) => apiClient.get(url, config);
export const post = (url, data = {}, config = {}) => apiClient.post(url, data, config);
export const put = (url, data = {}, config = {}) => apiClient.put(url, data, config);
export const patch = (url, data = {}, config = {}) => apiClient.patch(url, data, config);
export const del = (url, config = {}) => apiClient.delete(url, config);

export default apiClient;
