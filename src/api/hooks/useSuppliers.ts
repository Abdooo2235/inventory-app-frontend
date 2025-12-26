import useSWR from 'swr';
import { api, fetcher } from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { Supplier } from '@/types';
import type { SupplierFormData } from '@/schemas/supplierSchema';

interface UseSuppliersOptions {
  search?: string;
}

// Fetch all suppliers
export function useSuppliers(options?: UseSuppliersOptions) {
  const params = new URLSearchParams();
  if (options?.search) {
    params.append('filter[name]', options.search);
  }

  const queryString = params.toString();
  const url = queryString 
    ? `${ENDPOINTS.SUPPLIERS.BASE}?${queryString}` 
    : ENDPOINTS.SUPPLIERS.BASE;

  const { data, error, isLoading, mutate } = useSWR<Supplier[]>(url, fetcher);

  // Ensure suppliers is always an array
  const suppliers = Array.isArray(data) ? data : [];

  return {
    suppliers,
    error,
    isLoading,
    mutate,
  };
}

// Fetch single supplier by ID
export function useSupplier(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Supplier>(
    id ? ENDPOINTS.SUPPLIERS.BY_ID(id) : null,
    fetcher
  );

  return {
    supplier: data,
    error,
    isLoading,
    mutate,
  };
}

// Supplier mutations
export const supplierApi = {
  create: async (data: SupplierFormData) => {
    const response = await api.post(ENDPOINTS.SUPPLIERS.BASE, data);
    return response.data;
  },

  update: async (id: string, data: SupplierFormData) => {
    const response = await api.put(ENDPOINTS.SUPPLIERS.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(ENDPOINTS.SUPPLIERS.BY_ID(id));
    return response.data;
  },
};
