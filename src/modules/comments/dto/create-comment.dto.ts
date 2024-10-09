import { z } from 'zod';

export const commentCreateDtoSchema = z.object({
  userId: z
    .string()
    .uuid('Invalid user id'),
  content: z
    .string(),
});

export type CreateCommentDto = z.infer<typeof commentCreateDtoSchema>;