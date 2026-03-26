import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServerApi } from '@app/sdk/ApiServer';
import { contracts } from '@app/contracts';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { ErrorTools } from './ErrorTools';
import { BACKEND_URL, BACKEND_HOST, BACKEND_PORT, BUN_MODE } from '../env';

// Accept both localhost and 127.0.0.1 — browsers treat them as different origins.
const FRONTEND_PORT = process.env.FRONTEND_PORT ?? '5173';
const ALLOWED_ORIGINS = [`http://localhost:${FRONTEND_PORT}`, `http://127.0.0.1:${FRONTEND_PORT}`];

/**
 * @description Core Express application.
 * Isolated from the SDK to allow independent middleware configuration (CORS, Helmet, etc.).
 */
const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

/**
 * @description SDK API Singleton.
 * Bridges Zod contracts with Express routing and security guards.
 * Uses the collectContracts helper to aggregate all module contracts into a single tuple.
 */
export const api = createServerApi(contracts, {
  security: {
    auth: authMiddleware,
    role: roleMiddleware,
  },
  routerFactory: () => Router(),
  onError: ErrorTools.catch,
  env: {
    url: BACKEND_URL,
    host: BACKEND_HOST,
    port: BACKEND_PORT,
    mode: BUN_MODE,
  },
});

export default app;
