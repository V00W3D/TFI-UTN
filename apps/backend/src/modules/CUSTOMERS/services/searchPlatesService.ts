/**
 * @file searchPlatesService.ts
 * @module CUSTOMERS
 * @description Archivo searchPlatesService alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-19
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
import type { SearchPlatesContract, SearchPlatesQuery } from '@app/contracts';
import type { Prisma } from '../../../../prisma/generated/client';
import { prisma as db } from '../../../tools/db';
import { plateCatalogInclude } from './plateCatalogInclude';
import type { PlateCatalogRecord } from './plateCatalogInclude';
import { mapPlateRecordToDto } from './plateCatalogMap';

export const searchPlatesService = async (
  params: SearchPlatesQuery,
): Promise<InferSuccess<typeof SearchPlatesContract>> => {
  const {
    q,
    sort,
    page,
    pageSize,
    minPrice,
    maxPrice,
    minCalories,
    maxCalories,
    minProtein,
    maxProtein,
    minFat,
    maxFat,
    minRating,
    minRatingsCount,
    minLikes,
    maxPrepMinutes,
    maxCookMinutes,
    minYieldServings,
    maxYieldServings,
    minServedWeightGrams,
    maxServedWeightGrams,
    recipeTypes,
    flavors,
    difficulties,
    sizes,
    excludeAllergens,
    dietaryTags,
    nutritionTags,
    recipeDietaryTags,
    tagNames,
  } = params;

  try {
    const clauses: Prisma.PlateWhereInput[] = [
      { isAvailable: true },
      { recipe: { isActive: true } },
    ];

    const qq = q?.trim();
    if (qq) {
      clauses.push({
        OR: [
          { name: { contains: qq, mode: 'insensitive' } },
          { description: { contains: qq, mode: 'insensitive' } },
          { recipe: { name: { contains: qq, mode: 'insensitive' } } },
        ],
      });
    }

    if (recipeTypes?.length) {
      clauses.push({ recipe: { type: { in: recipeTypes } } });
    }
    if (flavors?.length) {
      clauses.push({ recipe: { flavor: { in: flavors } } });
    }
    if (difficulties?.length) {
      clauses.push({ recipe: { difficulty: { in: difficulties } } });
    }
    if (sizes?.length) {
      clauses.push({ size: { in: sizes } });
    }

    if (minPrice != null || maxPrice != null) {
      const menuPrice: Prisma.DecimalFilter = {};
      if (minPrice != null) menuPrice.gte = minPrice;
      if (maxPrice != null) menuPrice.lte = maxPrice;
      clauses.push({ menuPrice });
    }

    if (minCalories != null || maxCalories != null) {
      const calculatedCalories: Prisma.FloatFilter = {};
      if (minCalories != null) calculatedCalories.gte = minCalories;
      if (maxCalories != null) calculatedCalories.lte = maxCalories;
      clauses.push({ calculatedCalories });
    }

    if (minProtein != null || maxProtein != null) {
      const calculatedProteins: Prisma.FloatFilter = {};
      if (minProtein != null) calculatedProteins.gte = minProtein;
      if (maxProtein != null) calculatedProteins.lte = maxProtein;
      clauses.push({ calculatedProteins });
    }

    if (minFat != null || maxFat != null) {
      const calculatedFats: Prisma.FloatFilter = {};
      if (minFat != null) calculatedFats.gte = minFat;
      if (maxFat != null) calculatedFats.lte = maxFat;
      clauses.push({ calculatedFats });
    }

    if (minRating != null) {
      clauses.push({ avgRating: { gte: minRating } });
    }
    if (minRatingsCount != null) {
      clauses.push({ ratingsCount: { gte: minRatingsCount } });
    }
    if (minLikes != null) {
      clauses.push({ likesCount: { gte: minLikes } });
    }

    if (maxPrepMinutes != null) {
      clauses.push({
        recipe: {
          OR: [{ prepTimeMinutes: { lte: maxPrepMinutes } }, { prepTimeMinutes: null }],
        },
      });
    }
    if (maxCookMinutes != null) {
      clauses.push({
        recipe: {
          OR: [{ cookTimeMinutes: { lte: maxCookMinutes } }, { cookTimeMinutes: null }],
        },
      });
    }

    if (minYieldServings != null) {
      clauses.push({ recipe: { yieldServings: { gte: minYieldServings } } });
    }
    if (maxYieldServings != null) {
      clauses.push({ recipe: { yieldServings: { lte: maxYieldServings } } });
    }

    if (minServedWeightGrams != null || maxServedWeightGrams != null) {
      const servedWeightGrams: Prisma.FloatNullableFilter = {};
      if (minServedWeightGrams != null) servedWeightGrams.gte = minServedWeightGrams;
      if (maxServedWeightGrams != null) servedWeightGrams.lte = maxServedWeightGrams;
      clauses.push({ servedWeightGrams });
    }

    if (excludeAllergens?.length) {
      clauses.push({
        NOT: {
          allergens: { hasSome: excludeAllergens },
        },
      });
    }

    for (const tag of dietaryTags ?? []) {
      clauses.push({ dietaryTags: { has: tag } });
    }
    for (const tag of nutritionTags ?? []) {
      clauses.push({ nutritionTags: { has: tag } });
    }
    for (const tag of recipeDietaryTags ?? []) {
      clauses.push({ recipe: { dietaryTags: { has: tag } } });
    }

    for (const rawName of tagNames ?? []) {
      const name = rawName.trim();
      if (!name) continue;
      clauses.push({
        tags: {
          some: {
            tag: { name: { equals: name, mode: 'insensitive' } },
          },
        },
      });
    }

    const where: Prisma.PlateWhereInput = { AND: clauses };

    type OrderSpec = Prisma.PlateOrderByWithRelationInput | Prisma.PlateOrderByWithRelationInput[];

    const orderBy: OrderSpec =
      sort === 'price_asc'
        ? { menuPrice: 'asc' }
        : sort === 'price_desc'
          ? { menuPrice: 'desc' }
          : sort === 'rating_desc'
            ? [{ avgRating: 'desc' }, { ratingsCount: 'desc' }]
            : sort === 'rating_asc'
              ? { avgRating: 'asc' }
              : sort === 'name_desc'
                ? { name: 'desc' }
                : sort === 'popular_desc'
                  ? { saleItems: { _count: 'desc' } }
                  : { name: 'asc' };

    const total = await db.plate.count({ where });

    const plates = (await db.plate.findMany({
      where,
      include: plateCatalogInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    })) as PlateCatalogRecord[];

    return {
      items: plates.map(mapPlateRecordToDto),
      total,
      page,
      pageSize,
    };
  } catch {
    throw ERR.INTERNAL(['DATABASE_ERROR']);
  }
};
