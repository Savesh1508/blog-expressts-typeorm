import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCommentDto {
  @IsOptional()
  @IsUUID('4', { message: 'Invalid parent comment id' })
  parentCommentId?: string;

  @IsString()
  content!: string;
}