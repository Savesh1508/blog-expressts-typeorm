import { z } from "zod";

export const commentRouteParamsDtoSchema = z.object({
  id: z
    .string()
    .uuid()
});

export type CommentRouteParamsDto = z.infer<typeof commentRouteParamsDtoSchema>;