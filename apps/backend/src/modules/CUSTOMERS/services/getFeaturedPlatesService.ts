/**
 * @file getFeaturedPlatesService.ts
 * @module CUSTOMERS
 * @description Archivo getFeaturedPlatesService alineado a la arquitectura y trazabilidad QART.
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
import type { GetFeaturedPlatesContract } from '@app/contracts';
import { prisma as db } from '../../../tools/db';
import { plateCatalogInclude } from './plateCatalogInclude';
import { mapPlateRecordToDto } from './plateCatalogMap';

/**
 * @description Destacados: combina unidades vendidas (histórico) con rating y volumen de reseñas.
 */
export const getFeaturedPlatesService = async (input: {
  limit: number;
}): Promise<InferSuccess<typeof GetFeaturedPlatesContract>> => {
  const limit = input.limit;

  try {
    const sales = await db.saleItem.groupBy({
      by: ['plateId'],
      where: {
        plate: { isAvailable: true, recipe: { isActive: true } },
      },
      _sum: { quantity: true },
    });

    const soldByPlate = new Map<string, number>();
    for (const row of sales) {
      soldByPlate.set(row.plateId, row._sum.quantity ?? 0);
    }

    const candidates = await db.plate.findMany({
      where: {
        isAvailable: true,
        recipe: { isActive: true },
      },
      include: plateCatalogInclude,
    });

    type Scored = { id: string; score: number; units: number };

    const scored: Scored[] = candidates.map((p) => {
      const units = soldByPlate.get(p.id) ?? 0;
      const reviewBoost = p.ratingsCount > 0 ? p.avgRating * Math.log10(p.ratingsCount + 1) * 4 : 0;
      const score = units * 12 + reviewBoost;

      return { id: p.id, score, units };
    });

    scored.sort((a, b) => b.score - a.score);

    const pickedIds = scored.slice(0, limit).map((s) => s.id);
    let ordered = pickedIds
      .map((id) => candidates.find((c) => c.id === id))
      .filter((p): p is (typeof candidates)[number] => Boolean(p));

    if (ordered.length < limit) {
      const missing = limit - ordered.length;
      const rest = candidates
        .filter((p) => !ordered.some((o) => o.id === p.id))
        .sort((a, b) => {
          if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
          return b.ratingsCount - a.ratingsCount;
        })
        .slice(0, missing);
      ordered = [...ordered, ...rest];
    }

    return ordered.slice(0, limit).map((plate) => ({
      ...mapPlateRecordToDto(plate),
      unitsSold: soldByPlate.get(plate.id) ?? 0,
    }));
  } catch {
    throw ERR.INTERNAL(['DATABASE_ERROR']);
  }
};
