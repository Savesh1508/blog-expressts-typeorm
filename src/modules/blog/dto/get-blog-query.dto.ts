import { z } from 'zod';

export const getBlogsQueryDtoSchema = z.object({
  search: z
    .string()
    .optional(),

  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || val <= 1, {
      message: 'Page must be a number greater than or equal to 1',
    }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || val <= 1, {
      message: 'Limit must be a number between 1 and 100',
    }),
});

export type GetBlogsQueryDto = z.infer<typeof getBlogsQueryDtoSchema>;