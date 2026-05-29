import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z.enum(['true', 'false']).optional(),
  LOG_LEVEL: z.string().default('info'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(300),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

const data = parsed.data;

export const env = {
  nodeEnv: data.NODE_ENV,
  port: data.PORT,
  databaseUrl: data.DATABASE_URL,
  frontendUrl: data.FRONTEND_URL,
  redisUrl: data.REDIS_URL,
  jwt: {
    accessSecret: data.JWT_ACCESS_SECRET,
    refreshSecret: data.JWT_REFRESH_SECRET,
    accessExpiry: data.ACCESS_TOKEN_EXPIRES_IN,
    refreshExpiry: data.REFRESH_TOKEN_EXPIRES_IN,
  },
  cookie: {
    domain: data.COOKIE_DOMAIN,
    secure:
      data.COOKIE_SECURE !== undefined
        ? data.COOKIE_SECURE === 'true'
        : data.NODE_ENV === 'production',
  },
  logLevel: data.LOG_LEVEL,
  rateLimit: {
    windowMs: data.RATE_LIMIT_WINDOW_MS,
    max: data.RATE_LIMIT_MAX,
  },
} as const;

export type Env = typeof env;
