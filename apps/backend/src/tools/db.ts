import { PrismaClient } from '../../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '../env';

/**
 * @description Prisma Client Global Singleton.
 * Uses the @prisma/adapter-pg to optimize connection management within the Bun environment.
 */
export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

/**
 * @description SDK Database Adapter.
 * Encapsulates Prisma's connection lifecycle for the SDK's initialization flow.
 * Ensures the database is reachable before the HTTP server starts listening.
 */
export const prismaAdapter = {
  name: 'prisma',
  instance: prisma,
  connect: () => prisma.$connect(),
  disconnect: () => prisma.$disconnect(),
};
