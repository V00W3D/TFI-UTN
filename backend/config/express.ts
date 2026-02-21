import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { BACKEND_HOST, BACKEND_PORT, BACKEND_URL } from '../../env';
const app = express();

/* =========================
   MIDDLEWARE
========================= */
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

/* =========================
   SERVER START
========================= */
export const start = async () => {
  return new Promise<void>((resolve, reject) => {
    const server = app.listen(BACKEND_PORT, BACKEND_HOST, () => {
      console.log(`[EXPRESS] '${BACKEND_URL}'`);
      resolve();
    });

    server.on('error', (err) => {
      reject(err);
    });
  });
};

export default app;
