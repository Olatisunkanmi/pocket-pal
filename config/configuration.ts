import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
  ValidationError,
} from 'class-validator';

// Supported environments
enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Error = 'error',
  Verbose = 'verbose',
}

/**
 * @class EnvironmentVariables
 *
 * Define the environment variables and their formats that are
 * required when the service starts using the class-validator. The
 * variables are defined in the .env.${NODE_ENV} files.
 */

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  APP_NAME: string;

  @IsString()
  APP_PORT: string;

  @IsString()
  @IsOptional()
  APP_VERSION: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  SPOTIFY_ID: string;

  @IsString()
  @IsOptional()
  SPOTIFY_SECRET: string;

  @IsString()
  @IsOptional()
  SPOTIFY_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  SPOTIFY_CALLBACK_URL: string;

  @IsUrl()
  @IsOptional()
  SPOTIFY_AUTHORIZE_URL: string;

  @IsUrl()
  @IsOptional()
  SPOTIFY_TOKEN_URL: string;

  @IsString()
  @IsOptional()
  SPOTIFY_API_URL: string;
}

/**
 * @function validate
 *
 * Validates the format of the environment variables defined in the
 * .env.${NODE_ENV} files. Throws an exception to stop the app from
 * running if their is an invalid configuration variable.
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages: string[] = [];
    errors.forEach((error) => {
      if (error instanceof ValidationError) {
        const message = `Abort startup w/ invalid configuration: ${error.property} equals ${error.value} is invalid`;
        messages.push(message);
      }
    });
    throw new Error(messages[0]);
  }
  return validatedConfig;
}

/**
 * @function configuration
 *
 * Converts the app environment variables to a configuration object that
 * can be accessed in the app.
 */

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV || Environment.Development,
  appName: process.env.APP_NAME || 'Wallet api',
  LogLevel: process.env.LOG_LEVEL || LogLevel.Debug,
  appRoot: process.cwd(),
  port: parseInt(process.env.APP_PORT, 10) || 3456,
  hostname: process.env.APP_HOSTNAME || '0.0.0.0',
  host:
    process.env.APP_HOST || `http://localhost:${process.env.APP_PORT || 3456}`,
  app:
    process.env.APP_URL || `http://localhost:${process.env.APP_PORT || 3000}`,
  apiPrefix: process.env.API_PREFIX || 'api',
  prodUrl: process.env.PROD_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});
