import { z } from 'zod';

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional(),
});

// Infer TypeScript type from schema
export type CategoryFormData = z.infer<typeof categorySchema>;
