import { IsUUID } from "class-validator";

export class CommentRouteParamsDto {
  @IsUUID('4', { message: 'Invalid comment id' })
  id!: string;
}