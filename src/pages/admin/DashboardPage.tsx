import { Package, FolderTree, AlertTriangle, Users, ShoppingCart, DollarSign, Clock, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useProducts, useLowStockProducts } from '@/api/hooks/useProducts';
import { useCategories } from '@/api/hooks/useCategories';
import { useUsers } from '@/api/hooks/useUsers';
import { useOrders } from '@/api/hooks/useOrders';

// Format date helper
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Status colors for orders
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function DashboardPage() {
  // Fetch real data from API
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { users, isLoading: usersLoading } = useUsers();
  const { products: lowStockProducts, isLoading: lowStockLoading } = useLowStockProducts();
  const { orders, isLoading: ordersLoading } = useOrders();

  const isLoading = productsLoading || categoriesLoading || usersLoading || lowStockLoading || ordersLoading;

  // Calculate stats from real data
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, order) => 
    sum + (order.totalPrice || order.totalAmount || 0), 0
  );
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = {
    totalProducts: products.length,
    categories: categories.length,
    lowStock: lowStockProducts.length,
    users: users.length,
    totalOrders: orders.length,
    pendingOrders: pendingOrders.length,
    totalRevenue,
  };

  // Sort products by quantity for best-selling display (in real app, this would be from a separate endpoint)
  const topProducts = [...products]
    .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Inventory Management System
        </p>
      </div>

      {/* Stats Grid - First Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          description="Products in inventory"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          description="All time orders"
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          description="Awaiting approval"
          trend={stats.pendingOrders > 0 ? { value: stats.pendingOrders, isPositive: false } : undefined}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          description="From completed orders"
        />
      </div>

      {/* Stats Grid - Second Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Categories"
          value={stats.categories}
          icon={FolderTree}
          description="Active categories"
        />
        <StatsCard
          title="Low Stock"
          value={stats.lowStock}
          icon={AlertTriangle}
          description="Products need attention"
          trend={stats.lowStock > 0 ? { value: stats.lowStock, isPositive: false } : undefined}
        />
        <StatsCard
          title="Users"
          value={stats.users}
          icon={Users}
          description="Registered users"
        />
      </div>

      {/* Charts / Tables Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.name || 'User'} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        ${(order.totalPrice || order.totalAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products by Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Top Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                    <p className="font-medium">${product.price.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Low Stock Alerts</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                    <Badge variant="destructive">{product.quantity} left</Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">All products are well-stocked! 🎉</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
