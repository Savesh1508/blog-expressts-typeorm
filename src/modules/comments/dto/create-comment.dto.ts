import { z } from 'zod';

export const commentCreateDtoSchema = z.object({
  userId: z
    .string()
    .uuid('Invalid user id'),
  parentCommentId: z
    .string()
    .uuid('Invalid parent comment id')
    .optional(),
  content: z
    .string(),
});

export type CreateCommentDto = z.infer<typeof commentCreateDtoSchema>;