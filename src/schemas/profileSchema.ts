import { z } from "zod";

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Valid email is required"),
});

// Password change schema
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Infer TypeScript types from schemas
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
