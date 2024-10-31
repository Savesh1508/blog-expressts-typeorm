import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBlogDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}