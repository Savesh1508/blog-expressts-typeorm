import { IsEnum, IsInt, IsNumber, IsPositive, IsString } from 'class-validator'

export class EnvConfig {
  @IsEnum(['development', 'production', 'test'])
  APP_ENV!: string

  @IsInt()
  @IsPositive()
  PORT: number = 3000

  @IsString()
  DB_HOST: string = 'localhost'

  @IsInt()
  @IsPositive()
  DB_PORT: number = 5432

  @IsString()
  DB_USERNAME: string = 'postgres'

  @IsString()
  DB_PASSWORD!: string

  @IsString()
  DB_NAME!: string

  @IsString()
  JWT_SECRET!: string

  @IsString()
  ACCESS_KEY!: string

  @IsString()
  REFRESH_KEY!: string

  @IsString()
  ACCESS_TIME: string = '15m'

  @IsString()
  REFRESH_TIME: string = '5d'

  @IsNumber()
  @IsPositive()
  REFRESH_MS: number = 2592000000
}