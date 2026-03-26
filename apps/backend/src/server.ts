import { CUSTOMERRouter } from '@modules/CUSTOMERS';
import { IAMRouter } from '@modules/IAM';
import { api } from '@tools/api';
import app from '@tools/api';
import { prismaAdapter } from '@tools/db';
api
  .init({
    app: app,
    routers: [IAMRouter, CUSTOMERRouter],
    db: [prismaAdapter],
  })
  .start();
