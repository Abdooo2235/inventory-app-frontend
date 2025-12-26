import { z } from 'zod';

// Order item schema
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// Order request schema (for creating orders)
export const orderRequestSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
});

// Infer TypeScript types from schemas
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type OrderRequestFormData = z.infer<typeof orderRequestSchema>;
