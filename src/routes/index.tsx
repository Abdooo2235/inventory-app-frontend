import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

// Lazy load pages for code splitting
import { lazy, Suspense } from 'react';

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/ProductsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/UsersPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));

// User pages
const UserProductsPage = lazy(() => import('@/pages/user/ProductsPage'));
const UserOrdersPage = lazy(() => import('@/pages/user/OrdersPage'));
const UserSettingsPage = lazy(() => import('@/pages/user/SettingsPage'));

// Layouts
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));

// Loading fallback
function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ allowedRoles }: { allowedRoles?: ('admin' | 'user')[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user/products'} replace />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

// Public route wrapper (redirect if already authenticated)
function PublicRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user/products'} replace />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

// Router configuration
export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },

  // Admin routes
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        path: '/admin',
        element: <DashboardLayout role="admin" />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: 'products',
            element: <AdminProductsPage />,
          },
          {
            path: 'categories',
            element: <AdminCategoriesPage />,
          },
          {
            path: 'users',
            element: <AdminUsersPage />,
          },
          {
            path: 'settings',
            element: <AdminSettingsPage />,
          },
        ],
      },
    ],
  },

  // User routes
  {
    element: <ProtectedRoute allowedRoles={['user']} />,
    children: [
      {
        path: '/user',
        element: <DashboardLayout role="user" />,
        children: [
          {
            index: true,
            element: <Navigate to="/user/products" replace />,
          },
          {
            path: 'products',
            element: <UserProductsPage />,
          },
          {
            path: 'orders',
            element: <UserOrdersPage />,
          },
          {
            path: 'settings',
            element: <UserSettingsPage />,
          },
        ],
      },
    ],
  },

  // Root redirect
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // 404
  {
    path: '*',
    element: (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
      </div>
    ),
  },
]);
