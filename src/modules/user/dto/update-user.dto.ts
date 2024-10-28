import { z } from 'zod';

export const updateUserDtoSchema = z.object({
  username: z
    .string()
    .optional(),
  email: z
    .string()
    .email()
    .optional()
});

export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;