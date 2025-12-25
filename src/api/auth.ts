import { api } from './axios';
import { ENDPOINTS } from './endpoints';
import type { User } from '@/types';

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Auth API functions
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, credentials);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post(ENDPOINTS.AUTH.LOGOUT);
  },

  me: async (): Promise<User> => {
    const response = await api.get(ENDPOINTS.AUTH.ME);
    return response.data.data;
  },
};

export default authApi;
