import { z } from 'zod';

// Supplier validation schema
export const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Infer TypeScript type from schema
export type SupplierFormData = z.infer<typeof supplierSchema>;
