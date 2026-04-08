/**
 * @file GetPlatesService.ts
 * @module CUSTOMERS
 * @description Archivo GetPlatesService alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: datos del modulo y dependencias compartidas
 * outputs: comportamiento o estructuras del modulo
 * rules: respetar contratos, seguridad y trazabilidad definidas en context.md
 *
 * @technical
 * dependencies: dependencias locales del archivo
 * flow: inicializa, transforma y expone la logica del modulo
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: bloque agregado para cumplir el formato obligatorio de context.md
 */
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
