import { fileURLToPath } from 'node:url';
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

// Accept localhost, 127.0.0.1, and Replit proxied domains.
const FRONTEND_PORT = process.env.FRONTEND_PORT ?? '5173';
const FRONTEND_HOST = process.env.FRONTEND_HOST ?? '100.87.111.94';
const REPLIT_DEV_DOMAIN = process.env.REPLIT_DEV_DOMAIN;
const ALLOWED_ORIGINS: (string | RegExp)[] = [
  `http://${FRONTEND_HOST}:${FRONTEND_PORT}`,
  `http://127.0.0.1:${FRONTEND_PORT}`,
  ...(REPLIT_DEV_DOMAIN ? [`https://${REPLIT_DEV_DOMAIN}`] : []),
  /\.replit\.dev$/,
  `http://192.168.1.11:${FRONTEND_PORT}`,
  `http://localhost:${FRONTEND_PORT}`,
];

/**
 * @description Core Express application.
 * Isolated from the SDK to allow independent middleware configuration (CORS, Helmet, etc.).
 */
const app = express();
const PUBLIC_DIR = fileURLToPath(new URL('../../public', import.meta.url));

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(
  '/assets',
  express.static(PUBLIC_DIR, {
    setHeaders: (res) => {
      // Frontend and backend run on different origins in dev, so images need an explicit
      // resource policy that allows being embedded from the client app.
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  }),
);

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
