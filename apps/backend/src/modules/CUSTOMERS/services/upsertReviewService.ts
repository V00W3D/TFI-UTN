/**
 * @file upsertReviewService.ts
 * @module CUSTOMERS
 * @description Archivo upsertReviewService alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: @app/sdk, @app/contracts, db, plateCatalogMap
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
import type { UpsertReviewContract } from '@app/contracts';
import { prisma as db } from '../../../tools/db';
import { mapReviewWithUser } from './plateCatalogMap';

/**
 * @description Crea o actualiza la reseña del usuario y sincroniza avgRating / ratingsCount del plato.
 */
export const upsertReviewService = async (args: {
  userId: string;
  plateId: string;
  rating: number;
  comment?: string | null;
  recommends?: boolean;
}): Promise<InferSuccess<typeof UpsertReviewContract>> => {
  const plate = await db.plate.findFirst({
    where: { id: args.plateId, isAvailable: true, recipe: { isActive: true } },
    select: { id: true },
  });
  if (!plate) throw ERR.NOT_FOUND(['plateId']);

  try {
    await db.$transaction(async (tx) => {
      await tx.review.upsert({
        where: { userId_plateId: { userId: args.userId, plateId: args.plateId } },
        create: {
          userId: args.userId,
          plateId: args.plateId,
          rating: args.rating,
          comment: args.comment ?? null,
          recommends: args.recommends ?? null,
        },
        update: {
          rating: args.rating,
          comment: args.comment ?? null,
          recommends: args.recommends ?? null,
        },
      });

      const agg = await tx.review.aggregate({
        where: { plateId: args.plateId },
        _avg: { rating: true },
        _count: true,
      });

      await tx.plate.update({
        where: { id: args.plateId },
        data: {
          avgRating: agg._avg.rating ?? 0,
          ratingsCount: agg._count,
        },
      });
    });
  } catch {
    throw ERR.INTERNAL(['DATABASE_ERROR']);
  }

  const row = await db.review.findUnique({
    where: { userId_plateId: { userId: args.userId, plateId: args.plateId } },
    include: {
      user: { select: { id: true, name: true, sname: true, lname: true, username: true } },
    },
  });
  if (!row) throw ERR.INTERNAL(['REVIEW_PERSIST_FAILED']);
  return mapReviewWithUser(row);
};
