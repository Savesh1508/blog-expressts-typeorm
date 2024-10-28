import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envConfigSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().positive().default(3000),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string(),
  ACCESS_KEY: z.string(),
  REFRESH_KEY: z.string(),
  ACCESS_TIME: z.string().default('15m'),
  REFRESH_TIME: z.string().default('5d'),
  REFRESH_MS: z.coerce.number().int().positive().default(2592000000),
})

export type EnvConfig = z.infer<typeof envConfigSchema>

export function validateEnv(config:unknown):EnvConfig {
  const parsedConfig = envConfigSchema.safeParse(config)

  if (!parsedConfig.success) {
    const errors = parsedConfig.error.errors.map((error) => {
      return {
        field: error.path.join('.'),
        message: error.message
      }
    })

    throw new Error(`Config validation error: ${JSON.stringify(errors)}`)
  }

  return parsedConfig.data
}

export const envConfig = validateEnv(process.env)

