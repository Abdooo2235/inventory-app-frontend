import useSWR from 'swr';
import { api, fetcher } from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { User } from '@/types';
import type { UserFormData } from '@/schemas/userSchema';

// Fetch all users (admin only)
export function useUsers(search?: string) {
  const url = search
    ? `${ENDPOINTS.USERS.BASE}?search=${encodeURIComponent(search)}`
    : ENDPOINTS.USERS.BASE;

  const { data, error, isLoading, mutate } = useSWR<User[]>(url, fetcher);

  // Ensure users is always an array
  const users = Array.isArray(data) ? data : [];

  return {
    users,
    error,
    isLoading,
    mutate,
  };
}

// Fetch single user by ID
export function useUser(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    id ? ENDPOINTS.USERS.BY_ID(id) : null,
    fetcher
  );

  return {
    user: data,
    error,
    isLoading,
    mutate,
  };
}

// User mutations (create, delete - no edit per requirements)
export const userApi = {
  create: async (data: UserFormData) => {
    const response = await api.post(ENDPOINTS.USERS.BASE, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },
};
