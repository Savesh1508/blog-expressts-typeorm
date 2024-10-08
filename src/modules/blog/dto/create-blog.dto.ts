import { IsNotEmpty, IsUUID, MaxLength, IsArray, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsUUID()
  authorId!: string;

  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsNotEmpty()
  content!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];
}
