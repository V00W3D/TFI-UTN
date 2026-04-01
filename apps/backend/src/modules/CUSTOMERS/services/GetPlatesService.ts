import { ERR, type InferSuccess } from '@app/sdk';
import type { GetPlatesContract } from '@app/contracts';
import { prisma as db } from '../../../tools/db';
import { plateCatalogInclude } from './plateCatalogInclude';
import { mapPlateRecordToDto } from './plateCatalogMap';

/**
 * @description Catálogo público completo.
 */
export const getPlatesService = async (): Promise<InferSuccess<typeof GetPlatesContract>> => {
  try {
    const plates = await db.plate.findMany({
      where: {
        isAvailable: true,
        recipe: { isActive: true },
      },
      include: plateCatalogInclude,
      orderBy: [{ likesCount: 'desc' }, { avgRating: 'desc' }, { name: 'asc' }],
    });

    return plates.map(mapPlateRecordToDto);
  } catch {
    throw ERR.INTERNAL(['DATABASE_ERROR']);
  }
};
