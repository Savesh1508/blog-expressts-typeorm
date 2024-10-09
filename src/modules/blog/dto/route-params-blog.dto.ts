import { z } from "zod";

export const blogRouteParamsDtoSchema = z.object({
  id: z
    .string()
    .uuid()
});

export type BlogRouteParamsDto = z.infer<typeof blogRouteParamsDtoSchema>;