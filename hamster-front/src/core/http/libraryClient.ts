import axios from 'axios';

const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';
const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = IS_MOCK ? '/mock' : API_URL;
export const libraryApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
libraryApiClient.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
libraryApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
