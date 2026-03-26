import { prisma as db } from '../../../tools/db';
import { ERR } from '@app/sdk';

/**
 * @description Retrieves all QART plates with full nutritional macros and reviews.
 */
export const getPlatesService = async () => {
  try {
    const plates = await db.plate.findMany({
      where: { isAvailable: true },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: {
        recommendations: 'desc', // Top liked plates first
      },
    });

    return plates;
  } catch {
    throw ERR.INTERNAL(['DATABASE_ERROR']);
  }
};
