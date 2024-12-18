import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!:string;

  @IsString()
  @MinLength(8)
  password!: string;

   @IsString()
  @MinLength(8)
  confirmPassword!: string;
}