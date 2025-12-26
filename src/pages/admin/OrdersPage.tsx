import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Eye, Loader2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/common';
import { toast } from '@/components/ui/sonner';
import { useOrders, orderApi } from '@/api/hooks/useOrders';
import type { Order } from '@/types';

// Format date helper
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Status badge variants
const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  approved: 'default',
  completed: 'default',
  rejected: 'destructive',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Fetch all orders
  const { orders, isLoading, mutate } = useOrders();

  // Filter orders by status
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setIsUpdating(orderId);
    try {
      await orderApi.updateStatus(orderId, newStatus);
      const statusLabels: Record<string, string> = { pending: 'set to pending', approved: 'approved', rejected: 'rejected', completed: 'marked as completed' };
      toast.success(`Order ${statusLabels[newStatus] || 'updated'} successfully!`);
      mutate();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(null);
    }
  };

  // View order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  // Calculate order total
  const getOrderTotal = (order: Order) => {
    return order.totalPrice || order.totalAmount ||
      order.items?.reduce((sum, item) => sum + (item.subtotal || item.quantity * item.price), 0) || 0;
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => <span className="font-mono text-sm">#{row.getValue('id')}</span>,
    },
    {
      accessorKey: 'user',
      header: 'Customer',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div>
            <p className="font-medium">{order.user?.name || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">{order.user?.email || ''}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => {
        const items = row.original.items || [];
        return <span className="text-sm">{items.length} item(s)</span>;
      },
    },
    {
      accessorKey: 'totalPrice',
      header: 'Total',
      cell: ({ row }) => {
        const total = getOrderTotal(row.original);
        return <span className="font-medium">${total.toFixed(2)}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge className={statusColors[status] || ''} variant={statusVariants[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
        const date = row.original.orderDate || row.original.createdAt;
        return <span className="text-sm">{formatDate(date)}</span>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const order = row.original;
        const isCurrentlyUpdating = isUpdating === order.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isCurrentlyUpdating}>
                {isCurrentlyUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(order.id, 'approved')}
                disabled={order.status === 'approved' || order.status === 'completed'}
              >
                ✅ Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(order.id, 'rejected')}
                disabled={order.status === 'rejected' || order.status === 'completed'}
              >
                ❌ Reject
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(order.id, 'completed')}
                disabled={order.status !== 'approved'}
              >
                ✔️ Mark Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and track all customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredOrders} />
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Order placed on {selectedOrder && formatDate(selectedOrder.orderDate || selectedOrder.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p className="text-sm"><strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}</p>
                <p className="text-sm"><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
              </div>

              {/* Order Items */}
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-2 last:border-0">
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
                <div className="mt-4 pt-4 border-t flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${getOrderTotal(selectedOrder).toFixed(2)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <Badge className={statusColors[selectedOrder.status]} variant={statusVariants[selectedOrder.status]}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrdersPage;
