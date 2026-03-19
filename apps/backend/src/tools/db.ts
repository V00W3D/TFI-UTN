/**
 * @file apps/backend/src/db.ts
 * @description Prisma client + DatabaseAdapter for startup health check.
 *
 * Import `prisma` for queries in repositories.
 * Import `prismaAdapter` and pass it to `api.init({ db: [prismaAdapter] })`.
 * The server will call `$connect()` before listening — if it fails, it exits.
 */

import { PrismaClient } from 'prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '@env';
import type { DatabaseAdapter } from '@app/sdk/ApiServer';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

/**
 * @public Adapter passed to `api.init({ db: [prismaAdapter] })`.
 * The SDK calls `connect()` before starting the HTTP server —
 * if Prisma can't connect, the server exits with code 1.
 */
export const prismaAdapter: DatabaseAdapter = {
  name: 'prisma',
  url: DATABASE_URL,
  connect: () => prisma.$connect(),
};
