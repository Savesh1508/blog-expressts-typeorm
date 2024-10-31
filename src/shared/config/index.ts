import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import dotenv from 'dotenv'
import { EnvConfig } from './env.config'

dotenv.config()

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const envConfig = plainToInstance(EnvConfig, config, { enableImplicitConversion: true })
  const errors = validateSync(envConfig)

  if (errors.length > 0) {
    const errorMessages = errors.flatMap(error => ({
      message: Object.values(error.constraints || {})
    }));

    throw new Error(`Config validation error: ${JSON.stringify(errorMessages)}`)
  }

  return envConfig
}

export const envConfig = validateEnv(process.env)
