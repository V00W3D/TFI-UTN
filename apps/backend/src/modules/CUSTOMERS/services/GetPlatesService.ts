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
 * inputs: payloads tipados, ids autenticados, helpers compartidos y acceso a Prisma cuando aplica
 * outputs: datos de dominio listos para contrato, mutaciones persistidas o payloads auxiliares
 * rules: normalizar datos, validar reglas de dominio y preservar consistencia transaccional
 *
 * @technical
 * dependencies: @app/sdk, @app/contracts, db, plateCatalogInclude, plateCatalogMap
 * flow: normaliza los datos recibidos; consulta o muta dependencias de dominio e infraestructura; arma la respuesta del caso de uso; devuelve un resultado consumible por handlers u otros servicios.
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
 * decisions: la logica de negocio se concentra en funciones async reutilizables y desacopladas del transporte
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
