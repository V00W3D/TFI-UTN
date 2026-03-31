import { z } from 'zod';

/* =========================
   ENV VALIDATION (VITE)
========================= */

const envSchema = z.object({
  VITE_MODE: z.enum(['dev', 'prod']),

  VITE_BACKEND_HOST: z.string().optional().default(''),
  VITE_BACKEND_PORT: z.string().optional().default(''),

  /**
   * When set (even to empty string), overrides the constructed host+port URL.
   * Set to '' to enable Vite proxy mode (browser uses relative paths).
   * Leave unset to fall back to VITE_BACKEND_HOST + VITE_BACKEND_PORT.
   */
  VITE_BACKEND_URL: z.string().optional(),
});

const parsed = envSchema.parse(import.meta.env);

/* =========================
   MODE
========================= */

export const MODE = parsed.VITE_MODE;

const protocol = MODE === 'prod' ? 'https' : 'http';

/* =========================
   BACKEND
========================= */

export const BACKEND_HOST = parsed.VITE_BACKEND_HOST;
export const BACKEND_PORT = parsed.VITE_BACKEND_PORT ? Number(parsed.VITE_BACKEND_PORT) : 0;

const constructedURL =
  BACKEND_HOST && BACKEND_PORT ? `${protocol}://${BACKEND_HOST}:${BACKEND_PORT}` : '';

export const BACKEND_URL = parsed.VITE_BACKEND_URL || '';
