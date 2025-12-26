import useSWR from 'swr';
import { api, fetcher } from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { Category } from '@/types';
import type { CategoryFormData } from '@/schemas/categorySchema';

// Fetch all categories
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    ENDPOINTS.CATEGORIES.BASE,
    fetcher
  );

  // Ensure categories is always an array
  const categories = Array.isArray(data) ? data : [];

  return {
    categories,
    error,
    isLoading,
    mutate,
  };
}

// Fetch single category by ID
export function useCategory(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Category>(
    id ? ENDPOINTS.CATEGORIES.BY_ID(id) : null,
    fetcher
  );

  return {
    category: data,
    error,
    isLoading,
    mutate,
  };
}

// Category mutations (create, update, delete)
export const categoryApi = {
  create: async (data: CategoryFormData) => {
    const response = await api.post(ENDPOINTS.CATEGORIES.BASE, data);
    return response.data;
  },

  update: async (id: string, data: Partial<CategoryFormData>) => {
    const response = await api.put(ENDPOINTS.CATEGORIES.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(ENDPOINTS.CATEGORIES.BY_ID(id));
    return response.data;
  },
};
