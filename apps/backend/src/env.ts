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

  DATABASE_URL: z.url(),

  SESSION_SECRET: z.string(),
  REFRESH_SECRET: z.string(),
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
   DATABASE
========================= */

export const DATABASE_URL = parsed.DATABASE_URL;

/* =========================
   SECRETS
========================= */

export const SESSION_SECRET = parsed.SESSION_SECRET;
export const REFRESH_SECRET = parsed.REFRESH_SECRET;
