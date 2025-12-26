// API endpoint constants for easy maintenance

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },

  // Products
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    LOW_STOCK: "/products/stats/low-stock",
    BEST_SELLING: "/products/stats/best-selling",
  },

  // Categories
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
  },

  // Users
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Orders
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    MY_ORDERS: "/orders/my-orders",
  },

  // Suppliers
  SUPPLIERS: {
    BASE: "/suppliers",
    BY_ID: (id: string) => `/suppliers/${id}`,
  },

  // Dashboard stats (admin)
  DASHBOARD: {
    STATS: "/dashboard/stats",
  },

  // Profile
  PROFILE: {
    UPDATE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },
} as const;
