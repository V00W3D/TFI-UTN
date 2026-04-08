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
