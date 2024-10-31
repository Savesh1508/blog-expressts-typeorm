import { IsUUID } from "class-validator";

export class UserRouteParamsDto {
  @IsUUID('4', { message: 'Invalid user id' })
  id!: string;
}