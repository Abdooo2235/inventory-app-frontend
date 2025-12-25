import axios from 'axios';

// API Response wrapper type from Laravel
interface LaravelApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://inventory-management-backend.test/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied');
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

// Default fetcher for SWR - unwraps Laravel's {success, message, data} response
export const fetcher = <T>(url: string): Promise<T> =>
  api.get<LaravelApiResponse<T>>(url).then((res) => res.data.data);

// Fetcher that returns the full response (for paginated data)
export const paginatedFetcher = <T>(url: string): Promise<T> =>
  api.get<LaravelApiResponse<T>>(url).then((res) => res.data.data);

export default api;
