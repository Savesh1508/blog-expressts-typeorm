import { z } from 'zod';

export const blogUpdateDtoSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(255)
    .optional(),
  content: z
    .string()
    .optional(),
  tags: z
    .array(z.string())
    .optional()
});

export type UpdateBlogDto = z.infer<typeof blogUpdateDtoSchema>;