import useSWR from "swr";
import { api, fetcher } from "../axios";
import { ENDPOINTS } from "../endpoints";
import type { Product } from "@/types";
import type { ProductFormData } from "@/schemas/productSchema";

// Fetch all products
export function useProducts(params?: { categoryId?: string; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.categoryId) searchParams.append("category_id", params.categoryId);
  if (params?.search) searchParams.append("search", params.search);

  const queryString = searchParams.toString();
  const url = queryString
    ? `${ENDPOINTS.PRODUCTS.BASE}?${queryString}`
    : ENDPOINTS.PRODUCTS.BASE;

  const { data, error, isLoading, mutate } = useSWR<Product[]>(url, fetcher);

  // Ensure products is always an array
  const products = Array.isArray(data) ? data : [];

  return {
    products,
    error,
    isLoading,
    mutate,
  };
}

// Fetch single product by ID
export function useProduct(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    id ? ENDPOINTS.PRODUCTS.BY_ID(id) : null,
    fetcher
  );

  return {
    product: data,
    error,
    isLoading,
    mutate,
  };
}

// Fetch low stock products
export function useLowStockProducts() {
  const { data, error, isLoading } = useSWR<Product[]>(
    ENDPOINTS.PRODUCTS.LOW_STOCK,
    fetcher
  );

  // Ensure products is always an array
  const products = Array.isArray(data) ? data : [];

  return {
    products,
    error,
    isLoading,
  };
}

// Fetch best selling products
export function useBestSellingProducts() {
  const { data, error, isLoading } = useSWR<Product[]>(
    ENDPOINTS.PRODUCTS.BEST_SELLING,
    fetcher
  );

  // Ensure products is always an array
  const products = Array.isArray(data) ? data : [];

  return {
    products,
    error,
    isLoading,
  };
}

// Helper function to transform form data to API payload (camelCase to snake_case)
const transformToApiPayload = (data: ProductFormData) => ({
  name: data.name,
  sku: data.sku,
  description: data.description || null,
  price: data.price,
  quantity: data.quantity,
  category_id: data.categoryId,
  supplier_id: data.supplierId || null,
});

// Product mutations (create, update, delete)
export const productApi = {
  create: async (data: ProductFormData) => {
    const payload = transformToApiPayload(data);
    const response = await api.post(ENDPOINTS.PRODUCTS.BASE, payload);
    return response.data;
  },

  update: async (id: string, data: Partial<ProductFormData>) => {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.sku !== undefined) payload.sku = data.sku;
    if (data.description !== undefined)
      payload.description = data.description || null;
    if (data.price !== undefined) payload.price = data.price;
    if (data.quantity !== undefined) payload.quantity = data.quantity;
    if (data.categoryId !== undefined) payload.category_id = data.categoryId;
    if (data.supplierId !== undefined)
      payload.supplier_id = data.supplierId || null;

    const response = await api.put(ENDPOINTS.PRODUCTS.BY_ID(id), payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },
};
