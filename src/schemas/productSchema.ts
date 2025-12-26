import { z } from 'zod';

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU too long'),
  description: z.string().max(500, 'Description too long').optional(),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int('Quantity must be whole number').min(0, 'Quantity cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  supplierId: z.string().optional(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

// Infer TypeScript type from schema
export type ProductFormData = z.infer<typeof productSchema>;

// Schema for search/filter
export const productFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
});

export type ProductFilterData = z.infer<typeof productFilterSchema>;
