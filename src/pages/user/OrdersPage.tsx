import { ShoppingCart, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMyOrders } from '@/api/hooks/useOrders';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive'> = {
  pending: 'secondary',
  approved: 'default',
  completed: 'default',
  rejected: 'destructive',
};

export function OrdersPage() {
  // Fetch real data from API
  const { orders, isLoading } = useMyOrders();

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
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">View your order history ({orders.length} orders)</p>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            // Calculate total from order items
            const total = order.totalAmount || 
              order.items?.reduce((sum, item) => sum + (item.subtotal || item.quantity * item.price), 0) || 
              0;

            return (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={statusVariants[order.status] || 'secondary'}>
                    {order.statusLabel || order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{item.product?.name || 'Product'}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${(item.subtotal || item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <p className="text-lg font-bold">Total</p>
                    <p className="text-lg font-bold">${total.toFixed(2)}</p>
                  </div>
                  {order.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Notes: {order.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-lg font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground">
            Your order history will appear here
          </p>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
