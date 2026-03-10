import { PrismaClient } from '@config/db/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '@env';

const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});
