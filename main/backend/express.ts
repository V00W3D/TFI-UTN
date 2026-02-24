import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { BACKEND_HOST, BACKEND_PORT, BACKEND_URL } from '@env';
import cookieparser from 'cookie-parser';
import './pgsql';
import { AuthMiddleware } from 'main/backend/authmiddleware';
import IAMRoutes from '@IAM/backend/routes';
const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cookieparser());
app.use(express.json());
app.use(cors());
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
