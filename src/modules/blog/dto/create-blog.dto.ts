import { z } from 'zod';

export const blogCreateDtoSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(255),
  content: z
    .string(),
  tags: z
    .array(z.string())
    .optional()
});

export type CreateBlogDto = z.infer<typeof blogCreateDtoSchema>;