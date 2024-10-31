import { IsUUID } from "class-validator";

export class BlogRouteParamsDto {
  @IsUUID('4', { message: 'Invalid blog id' })
  id!: string;
}