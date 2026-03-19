/**
 * @file apps/backend/src/api.ts
 * @description Single source of truth for the Express app and server API instance.
 *
 * Everything Express-specific lives here — the SDK only receives adapters.
 * Import `app` and `api` from this file everywhere in the backend.
 */

import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { contracts } from '@app/contracts';
import { createServerApi } from '@app/sdk/ApiServer';
import { authMiddleware } from '@middleware/authMiddleware';
import { roleMiddleware } from '@middleware/roleMiddleware';
import { ErrorTools } from '@tools/ErrorTools';
import { BACKEND_HOST, BACKEND_PORT, BACKEND_URL, BUN_MODE } from '@env';

// ─────────────────────────────────────────────────────────────
//  Express app — fully configured here, never touched by the SDK.
// ─────────────────────────────────────────────────────────────
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://127.0.0.1:5173',
      'https://127.0.0.1:5173',
      'http://localhost:5173',
      'https://localhost:5173',
    ],
    credentials: true,
  }),
);
app.use(helmet());

app.get('/', (_req, res) => res.json({ status: 'ok' }));

// ─────────────────────────────────────────────────────────────
//  API instance — contracts + adapters.
//  The SDK gets exactly what it needs, nothing more.
// ─────────────────────────────────────────────────────────────
export const api = createServerApi(contracts, {
  routerFactory: () => Router(),

  security: {
    auth: authMiddleware,
    role: roleMiddleware,
  },

  onError: ErrorTools.catch,

  env: {
    url: BACKEND_URL,
    host: BACKEND_HOST,
    port: BACKEND_PORT,
    // BUN_MODE is a plain string from the env — cast to the narrower union the SDK expects.
    mode: BUN_MODE as 'dev' | 'prod',
  },
});

export type AppServerApi = typeof api;
export default app;
