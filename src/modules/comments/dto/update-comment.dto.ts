import { z } from 'zod';

export const commentUpdateDtoSchema = z.object({
  content: z
    .string()
    .optional(),
});

export type UpdateCommentDto = z.infer<typeof commentUpdateDtoSchema>;