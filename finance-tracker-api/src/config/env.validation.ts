import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, IsNumber, IsUrl, validateSync } from 'class-validator';
import * as Joi from 'joi';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;

  @IsString()
  SMS_API_KEY: string;

  @IsString()
  SMS_SENDER_ID: string;

  @IsUrl({ require_tld: false })
  CORS_ORIGIN: string;

  @IsNumber()
  RATE_LIMIT_TTL: number;

  @IsNumber()
  RATE_LIMIT_MAX: number;
}

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required(),
  SMS_API_KEY: Joi.string().required(),
  SMS_SENDER_ID: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required(),
  RATE_LIMIT_TTL: Joi.number().required(),
  RATE_LIMIT_MAX: Joi.number().required(),
});

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
