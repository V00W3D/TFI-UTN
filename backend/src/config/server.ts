import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { BACKEND_HOST, BACKEND_PORT, BACKEND_URL } from '@env';

import { initConductor } from '@tools/conductor';

const app = express();
const router = express.Router();

/* =========================
   INIT CONDUCTOR
========================= */

initConductor(router);

/* =========================
   LOAD ROUTES
========================= */

await import('@modules/IAM');

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());
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
app.use(morgan('dev'));

/* =========================
   HEALTH CHECK
========================= */

app.get('/', (_req: Request, res: Response) => {
  return res.json({ '~': ':D' });
});

/* =========================
   MOUNT ROUTER
========================= */

app.use(router);

/* =========================
   SERVER START
========================= */

export const start = () => {
  app.listen(BACKEND_PORT, BACKEND_HOST, (err?: any) => {
    if (err) throw err;

    console.log(`[EXPRESS] '${BACKEND_URL}'`);
  });
};

export default app;
