import express from 'express';
import type { Request, Response } from 'express';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { createExpressMiddleware } from '@trpc/server/adapters/express';

import { BACKEND_HOST, BACKEND_PORT, BACKEND_URL } from '@env';

import { appRouter } from '@_trpc/router';
import { createContext } from './trpc/context';

const app = express();

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
   TRPC ROUTER
========================= */

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

/* =========================
   SERVER START
========================= */

export const start = () => {
  app.listen(BACKEND_PORT, BACKEND_HOST, (err?: any) => {
    if (err) throw err;

    console.log(`[EXPRESS] '${BACKEND_URL}'`);
    console.log(`[TRPC] '${BACKEND_URL}/trpc'`);
  });
};

export default app;
