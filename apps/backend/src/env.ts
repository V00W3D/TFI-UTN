import { z } from 'zod';
import { config } from 'dotenv';
config();

/**
 * @description Environment configuration schema.
 * Enforces strict validation of all runtime dependencies to prevent "fail-late" scenarios.
 */
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

/** @description Validated application environment snapshot. */
const parsed = envSchema.parse(process.env);

/** @description Current execution mode (development vs production). */
export const BUN_MODE = parsed.BUN_MODE;

/** @description Protocol selection logic based on execution context. */
const protocol = BUN_MODE === 'prod' ? 'https' : 'http';

/** @description Primary backend network configuration. */
export const BACKEND_HOST = parsed.BACKEND_HOST;
export const BACKEND_PORT = Number(parsed.BACKEND_PORT);

/** @description Canonical backend URL for cross-service communication. */
export const BACKEND_URL = `${protocol}://${BACKEND_HOST}:${BACKEND_PORT}`;

/** @description Prisma-compatible database connection string. */
export const DATABASE_URL = parsed.DATABASE_URL;

/** @description Cryptographic secrets for JWT signing/verification. */
export const SESSION_SECRET = parsed.SESSION_SECRET;
export const REFRESH_SECRET = parsed.REFRESH_SECRET;
