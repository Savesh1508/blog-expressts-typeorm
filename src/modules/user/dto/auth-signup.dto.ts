import { z } from 'zod';

export const signUpDtoSchema = z.object({
  username: z
    .string(),
  email: z
    .string()
    .email(),
  password: z
    .string()
    .min(8),
  confirmPassword: z
    .string()
    .min(8)
});

export type SignUpDto = z.infer<typeof signUpDtoSchema>;