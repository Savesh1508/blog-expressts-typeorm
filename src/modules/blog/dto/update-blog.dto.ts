import { IsNotEmpty, MaxLength, IsArray, IsString } from 'class-validator';

export class UpdateBlogDto {
  @IsNotEmpty()
  @MaxLength(120)
  title?: string;

  @IsNotEmpty()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
