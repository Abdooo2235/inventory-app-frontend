import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data - TODO: Replace with SWR hook
const mockOrders = [
  {
    id: '1',
    orderDate: '2024-12-20',
    status: 'completed',
    items: [
      { productName: 'Laptop Pro', quantity: 1, price: 999.99 },
      { productName: 'Wireless Keyboard', quantity: 2, price: 79.99 },
    ],
  },
  {
    id: '2',
    orderDate: '2024-12-18',
    status: 'pending',
    items: [
      { productName: '4K Monitor', quantity: 1, price: 299.99 },
    ],
  },
  {
    id: '3',
    orderDate: '2024-12-15',
    status: 'approved',
    items: [
      { productName: 'USB Hub', quantity: 3, price: 39.99 },
      { productName: 'Webcam HD', quantity: 1, price: 89.99 },
    ],
  },
];

function calculateTotal(items: { quantity: number; price: number }[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">View your order history</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {mockOrders.map((order) => {
          const total = calculateTotal(order.items);

          return (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <Badge variant={statusVariants[order.status] || 'secondary'}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <p className="text-lg font-bold">Total</p>
                  <p className="text-lg font-bold">${total.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {mockOrders.length === 0 && (
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
