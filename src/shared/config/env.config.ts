import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsPositive, IsString } from 'class-validator';

export class EnvConfig {
  @IsEnum(['development', 'production', 'test'])
  APP_ENV!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  PORT!: number;

  @IsString()
  DB_HOST!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  DB_PORT!: number;

  @IsString()
  DB_USERNAME!: string;

  @IsString()
  DB_PASSWORD!: string;

  @IsString()
  DB_NAME!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  ACCESS_KEY!: string;

  @IsString()
  REFRESH_KEY!: string;

  @IsString()
  ACCESS_TIME!: string;

  @IsString()
  REFRESH_TIME!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  REFRESH_MS!: number;
}
