import { z } from 'zod';

export const commentCreateDtoSchema = z.object({
  parentCommentId: z
    .string()
    .uuid('Invalid parent comment id')
    .optional(),
  content: z
    .string(),
});

export type CreateCommentDto = z.infer<typeof commentCreateDtoSchema>;