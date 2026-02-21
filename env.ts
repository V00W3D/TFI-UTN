import { z } from 'zod';
import { config } from 'dotenv';
config();

/* =========================
   ENV VALIDATION
========================= */

const envSchema = z.object({
  BUN_MODE: z.enum(['dev', 'prod']),

  BACKEND_PORT: z.string(),
  BACKEND_HOST: z.string(),

  FRONTEND_PORT: z.string().optional(),
  FRONTEND_HOST: z.string().optional(),

  PGSQL_HOST: z.string(),
  PGSQL_PORT: z.string(),
  PGSQL_USERNAME: z.string(),
  PGSQL_PASSWORD: z.string(),
  PGSQL_DATABASE: z.string(),
  PGSQL_EXTRA: z.string().optional(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
});

const parsed = envSchema.parse(process.env);

/* =========================
   MODE
========================= */

export const BUN_MODE = parsed.BUN_MODE;

const protocol = BUN_MODE === 'prod' ? 'https' : 'http';

/* =========================
   BACKEND
========================= */

export const BACKEND_HOST = parsed.BACKEND_HOST;
export const BACKEND_PORT = Number(parsed.BACKEND_PORT);

export const BACKEND_URL = `${protocol}://${BACKEND_HOST}:${BACKEND_PORT}`;

/* =========================
   POSTGRESQL
========================= */

export const PG_URL = `postgresql://${parsed.PGSQL_USERNAME}:${parsed.PGSQL_PASSWORD}@${parsed.PGSQL_HOST}:${parsed.PGSQL_PORT}/${parsed.PGSQL_DATABASE}${parsed.PGSQL_EXTRA ?? ''}`;

/* =========================
   REDIS
========================= */

export const REDIS_URL = `redis://${parsed.REDIS_USERNAME}:${parsed.REDIS_PASSWORD}@${parsed.REDIS_HOST}:${parsed.REDIS_PORT}`;
