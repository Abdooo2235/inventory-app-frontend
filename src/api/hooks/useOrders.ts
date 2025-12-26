import useSWR from "swr";
import { api, fetcher } from "../axios";
import { ENDPOINTS } from "../endpoints";
import type { Order } from "@/types";
import type { OrderRequestFormData } from "@/schemas/orderSchema";

// Fetch user's orders
export function useMyOrders() {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    ENDPOINTS.ORDERS.MY_ORDERS,
    fetcher
  );

  // Ensure orders is always an array
  const orders = Array.isArray(data) ? data : [];

  return {
    orders,
    error,
    isLoading,
    mutate,
  };
}

// Fetch all orders (admin only)
export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    ENDPOINTS.ORDERS.BASE,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      dedupingInterval: 0, // Disable deduping to always fetch fresh data
    }
  );

  // Debug logging to help identify issues
  if (error) {
    console.error("Error fetching orders:", error);
  }

  // Ensure orders is always an array
  const orders = Array.isArray(data) ? data : [];

  return {
    orders,
    error,
    isLoading,
    mutate,
  };
}

// Fetch single order by ID
export function useOrder(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Order>(
    id ? ENDPOINTS.ORDERS.BY_ID(id) : null,
    fetcher
  );

  return {
    order: data,
    error,
    isLoading,
    mutate,
  };
}

// Order mutations
export const orderApi = {
  create: async (data: OrderRequestFormData) => {
    // Map frontend field names to backend field names
    const payload = {
      items: data.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      notes: data.notes,
    };
    const response = await api.post(ENDPOINTS.ORDERS.BASE, payload);
    return response.data;
  },

  updateStatus: async (id: string, status: Order["status"]) => {
    const response = await api.put(ENDPOINTS.ORDERS.BY_ID(id), { status });
    return response.data;
  },
};
