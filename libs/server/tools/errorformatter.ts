import { Prisma } from '@_prisma/generated/client';

export const errorFormatter = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return new Error('DB_UNIQUE');
    }

    if (error.code === 'P2025') {
      return new Error('DB_NOT_FOUND');
    }

    if (error.code === 'P2003') {
      return new Error('DB_FOREIGN_KEY');
    }
  }

  console.error(error);

  return new Error('INTERNAL_ERROR');
};
