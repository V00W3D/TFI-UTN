/**
 * @file api.ts
 * @module Backend
 * @description Archivo api alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
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
import {
  BACKEND_URL,
  BACKEND_HOST,
  BACKEND_PORT,
  BUN_MODE,
  FRONTEND_HOST,
  FRONTEND_PORT,
  CORS_EXTRA_ORIGINS,
  REPLIT_DEV_DOMAIN,
} from '../env';

const extraOrigins = CORS_EXTRA_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS: (string | RegExp)[] = [
  `http://${FRONTEND_HOST}:${FRONTEND_PORT}`,
  `http://127.0.0.1:${FRONTEND_PORT}`,
  `http://localhost:${FRONTEND_PORT}`,
  ...extraOrigins,
  ...(REPLIT_DEV_DOMAIN ? [`https://${REPLIT_DEV_DOMAIN}`] : []),
  /\.replit\.dev$/,
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
