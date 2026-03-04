import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { BACKEND_HOST, BACKEND_PORT, BACKEND_URL } from '@env';
import cookieparser from 'cookie-parser';
import { AuthMiddleware } from './authmiddleware';
import IAMRoutes from '@IAM/routes';
const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cookieparser());
app.use(express.json());
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
   ROUTES
========================= */
app.get('/', (_req: Request, res: Response) => {
  return res.json({ '~': ':D' });
});
app.use(IAMRoutes);
app.use(AuthMiddleware);
/* =========================
   SERVER START
========================= */
export const start = () => {
  app.listen(BACKEND_PORT, BACKEND_HOST, (err) => {
    if (err) throw err;
    console.log(`[EXPRESS] '${BACKEND_URL}'`);
  });
};

export default app;
