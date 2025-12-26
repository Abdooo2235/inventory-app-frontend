import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import type { Product } from '@/types';

interface OrderRequestDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (productId: string, quantity: number, notes?: string) => Promise<void>;
}

export function OrderRequestDialog({
  product,
  open,
  onOpenChange,
  onSubmit,
}: OrderRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create dynamic schema based on product stock
  const maxQuantity = product?.quantity || 0;

  const orderQuantitySchema = z.object({
    quantity: z
      .number({ message: 'Quantity must be a number' })
      .int({ message: 'Quantity must be a whole number' })
      .min(1, { message: 'Quantity must be at least 1' })
      .max(maxQuantity, { message: `Cannot exceed available stock (${maxQuantity})` }),
    notes: z.string().optional(),
  });

  type OrderQuantityFormData = z.infer<typeof orderQuantitySchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<OrderQuantityFormData>({
    resolver: zodResolver(orderQuantitySchema),
    defaultValues: {
      quantity: 1,
      notes: '',
    },
  });

  const quantity = watch('quantity');

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open && product) {
      reset({
        quantity: 1,
        notes: '',
      });
      setError(null);
    }
  }, [open, product, reset]);

  const handleFormSubmit = async (data: OrderQuantityFormData) => {
    if (!product) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(product.id, data.quantity, data.notes);
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Failed to place order. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  const inStock = product.quantity > 0;
  const subtotal = (product.price * (quantity || 0)).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Request Order
          </DialogTitle>
          <DialogDescription>
            Enter the quantity you want to order for {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Product Info */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{product.name}</span>
              <span className="text-muted-foreground">{product.sku}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Price per unit:</span>
              <span className="font-medium">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Available stock:</span>
              <span className={inStock ? 'text-green-600' : 'text-destructive'}>
                {product.quantity} units
              </span>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={maxQuantity}
              disabled={!inStock}
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
            {inStock && quantity > 0 && (
              <p className="text-sm text-muted-foreground">
                Subtotal: <span className="font-medium">${subtotal}</span>
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any special instructions..."
              rows={3}
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !inStock}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Place Order
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default OrderRequestDialog;
