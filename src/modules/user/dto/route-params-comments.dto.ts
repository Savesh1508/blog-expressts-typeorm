import { z } from "zod";

export const userRouteParamsDtoSchema = z.object({
  id: z
    .string()
    .uuid()
});

export type UserRouteParamsDto = z.infer<typeof userRouteParamsDtoSchema>;