import { IAMRouter } from '@modules/IAM';
import { InitializeApi } from '@tools/ApiFactory';

export const api = InitializeApi({
  cors: {
    origins: [
      'http://127.0.0.1:5173',
      'https://127.0.0.1:5173',
      'http://localhost:5173',
      'https://localhost:5173',
    ],
    credentials: true,
  },
  helmet: true,
  cookies: true,
  routers: [IAMRouter],
}).start();
