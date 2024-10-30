import { z } from 'zod';

export const changePasswordDtoSchema = z.object({
  currentPassword: z
    .string(),
  newPassword: z
    .string()
    .min(8),
  confirmPassword: z
    .string()
    .min(8)
});

export type ChangePasswordDto = z.infer<typeof changePasswordDtoSchema>;