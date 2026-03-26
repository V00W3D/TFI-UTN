import { prisma } from '@tools/db';
import type { Prisma } from '../../../prisma/generated/client';
import { ERR } from '@app/sdk';
import type { InferRequest, InferSuccess, RequestContext } from '@app/sdk';
import type { UserPayload } from '@middleware/authMiddleware';
import type {
  GetPlatesContract,
  GetPlateContract,
  CreatePlateContract,
  UpdatePlateContract,
  PatchPlateContract,
  DeletePlateContract,
  GetMyReviewsContract,
  GetReviewContract,
  CreateReviewContract,
  PatchReviewContract,
  DeleteReviewContract,
  GetIngredientsContract,
  GetIngredientContract,
  CreateIngredientContract,
  UpdateIngredientContract,
  PatchIngredientContract,
  DeleteIngredientContract,
  GetTagsContract,
  GetTagContract,
  ProposeTagContract,
  PatchTagContract,
  DeleteTagContract,
} from '@app/contracts';

//#region HELPERS

function requireSession(ctx: RequestContext): string {
  const session = ctx.req.user as UserPayload | undefined;
  if (!session?.id) throw ERR.UNAUTHORIZED();
  return session.id;
}

function asPagination(input: { page?: unknown; limit?: unknown }): {
  page: number;
  limit: number;
} {
  return {
    page: (input.page as number) ?? 1,
    limit: (input.limit as number) ?? 20,
  };
}

const PLATE_SELECT = {
  id: true,
  name: true,
  description: true,
  source: true,
  type: true,
  flavor: true,
  avgRating: true,
  ratingsCount: true,
  isAvailable: true,
  createdAt: true,
  ingredients: {
    select: {
      ingredient: { select: { id: true, name: true, flavor: true } },
    },
  },
  tags: {
    select: {
      tag: { select: { id: true, name: true } },
    },
  },
} as const;

type PlateRow = Prisma.PlateGetPayload<{ select: typeof PLATE_SELECT }>;

type FlavorLiteral = 'SWEET' | 'SALTY' | 'ACID' | 'BITTERSWEET' | 'UMAMI' | 'UNKNOWN';
type TypeLiteral = 'STARTER' | 'MAIN' | 'DESSERT' | 'SIDE' | 'SNACK' | 'DRINK';
type SourceLiteral = 'Q' | 'C';

function mapPlate(row: PlateRow): InferSuccess<typeof GetPlateContract> {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    source: row.source as SourceLiteral,
    type: row.type as TypeLiteral,
    flavor: row.flavor as FlavorLiteral,
    avgRating: Number(row.avgRating), // <-- Coerción a número primitivo
    ratingsCount: Number(row.ratingsCount), // <-- Lo aseguramos por las dudas
    isAvailable: row.isAvailable,
    createdAt: row.createdAt.toISOString(),
    ingredients: row.ingredients.map((pi) => ({
      id: pi.ingredient.id,
      name: pi.ingredient.name,
      flavor: pi.ingredient.flavor as FlavorLiteral,
    })),
    tags: row.tags.map((pt) => pt.tag),
  };
}

async function recalcPlateRating(plateId: string): Promise<void> {
  const agg = await prisma.review.aggregate({
    where: { plateId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.plate.update({
    where: { id: plateId },
    data: { avgRating: agg._avg.rating ?? 0, ratingsCount: agg._count.rating },
  });
}

//#endregion

//#region PLATE SERVICES

export async function getPlatesService(
  input: InferRequest<typeof GetPlatesContract>,
): Promise<InferSuccess<typeof GetPlatesContract>> {
  const { type, flavor, tag, available } = input;
  const { page, limit } = asPagination(input);

  const where: Prisma.PlateWhereInput = {
    ...(type !== undefined && { type }),
    ...(flavor !== undefined && { flavor }),
    ...(available !== undefined && { isAvailable: available === true }),
    ...(tag !== undefined && {
      tags: { some: { tag: { name: tag, isApproved: true, isActive: true } } },
    }),
  };

  type ListRow = Prisma.PlateGetPayload<{
    select: {
      id: true;
      name: true;
      description: true;
      type: true;
      flavor: true;
      avgRating: true;
      ratingsCount: true;
      isAvailable: true;
      tags: { select: { tag: { select: { id: true; name: true } } } };
    };
  }>;

  const [rows, total] = (await prisma.$transaction([
    prisma.plate.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        flavor: true,
        avgRating: true,
        ratingsCount: true,
        isAvailable: true,
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
      orderBy: { avgRating: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.plate.count({ where }),
  ])) as [ListRow[], number];

  return {
    items: rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      type: r.type as TypeLiteral,
      flavor: r.flavor as FlavorLiteral,
      avgRating: Number(r.avgRating), // <-- Coerción a número primitivo acá también
      ratingsCount: Number(r.ratingsCount),
      isAvailable: r.isAvailable,
      tags: r.tags.map((pt) => pt.tag),
    })),
    total,
    page,
    limit,
  };
}

export async function getPlateService(
  input: InferRequest<typeof GetPlateContract>,
): Promise<InferSuccess<typeof GetPlateContract>> {
  const row = await prisma.plate.findUnique({
    where: { id: input.id },
    select: PLATE_SELECT,
  });
  if (!row) throw ERR.NOT_FOUND(['id']);
  return mapPlate(row);
}

export async function createPlateService(
  input: InferRequest<typeof CreatePlateContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);
  const { name, description, source, type, flavor, ingredients, tags } = input;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const found = await tx.ingredient.findMany({
      where: { id: { in: ingredients }, isActive: true },
      select: { id: true },
    });
    if (found.length !== ingredients.length) throw ERR.NOT_FOUND(['ingredients']);

    if (tags?.length) {
      const foundTags = await tx.tag.findMany({
        where: { id: { in: tags }, isApproved: true, isActive: true },
        select: { id: true },
      });
      if (foundTags.length !== tags.length) throw ERR.NOT_FOUND(['tags']);
    }

    await tx.plate.create({
      data: {
        name,
        description,
        source: source as never,
        type: type as never,
        flavor: flavor as never,
        creatorId: userId,
        ingredients: { create: ingredients.map((id) => ({ ingredientId: id })) },
        ...(tags?.length && {
          tags: { create: tags.map((id) => ({ tagId: id })) },
        }),
      },
      select: { id: true },
    });

    await tx.creatorStats.upsert({
      where: { userId },
      create: { userId, totalPlates: 1 },
      update: { totalPlates: { increment: 1 } },
    });
  });
}

export async function updatePlateService(
  input: InferRequest<typeof UpdatePlateContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);
  const { id, name, description, source, type, flavor, isAvailable, ingredients, tags } = input;

  const plate = await prisma.plate.findUnique({
    where: { id },
    select: { creatorId: true },
  });
  if (!plate) throw ERR.NOT_FOUND(['id']);
  if (plate.creatorId !== userId) throw ERR.FORBIDDEN();

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const found = await tx.ingredient.findMany({
      where: { id: { in: ingredients }, isActive: true },
      select: { id: true },
    });
    if (found.length !== ingredients.length) throw ERR.NOT_FOUND(['ingredients']);

    if (tags?.length) {
      const foundTags = await tx.tag.findMany({
        where: { id: { in: tags }, isApproved: true, isActive: true },
        select: { id: true },
      });
      if (foundTags.length !== tags.length) throw ERR.NOT_FOUND(['tags']);
    }

    await tx.plateIngredient.deleteMany({ where: { plateId: id } });
    await tx.plateTag.deleteMany({ where: { plateId: id } });

    await tx.plate.update({
      where: { id },
      data: {
        name,
        description,
        source: source as never,
        type: type as never,
        flavor: flavor as never,
        isAvailable,
        ingredients: { create: ingredients.map((iid) => ({ ingredientId: iid })) },
        ...(tags?.length && {
          tags: { create: tags.map((tid) => ({ tagId: tid })) },
        }),
      },
    });
  });
}

export async function patchPlateService(
  input: InferRequest<typeof PatchPlateContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);
  const { id, ingredients, tags, ...scalar } = input;

  const plate = await prisma.plate.findUnique({
    where: { id },
    select: { creatorId: true },
  });
  if (!plate) throw ERR.NOT_FOUND(['id']);
  if (plate.creatorId !== userId) throw ERR.FORBIDDEN();

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (ingredients) {
      const found = await tx.ingredient.findMany({
        where: { id: { in: ingredients }, isActive: true },
        select: { id: true },
      });
      if (found.length !== ingredients.length) throw ERR.NOT_FOUND(['ingredients']);

      await tx.plateIngredient.deleteMany({ where: { plateId: id } });
      await tx.plateIngredient.createMany({
        data: ingredients.map((iid) => ({ plateId: id, ingredientId: iid })),
      });
    }

    if (tags) {
      const foundTags = await tx.tag.findMany({
        where: { id: { in: tags }, isApproved: true, isActive: true },
        select: { id: true },
      });
      if (foundTags.length !== tags.length) throw ERR.NOT_FOUND(['tags']);

      await tx.plateTag.deleteMany({ where: { plateId: id } });
      await tx.plateTag.createMany({
        data: tags.map((tid) => ({ plateId: id, tagId: tid })),
      });
    }

    const hasScalar =
      scalar.name !== undefined ||
      scalar.description !== undefined ||
      scalar.source !== undefined ||
      scalar.type !== undefined ||
      scalar.flavor !== undefined ||
      scalar.isAvailable !== undefined;

    if (hasScalar) {
      await tx.plate.update({
        where: { id },
        data: {
          ...(scalar.name !== undefined && { name: scalar.name }),
          ...(scalar.description !== undefined && { description: scalar.description }),
          ...(scalar.source !== undefined && { source: scalar.source as never }),
          ...(scalar.type !== undefined && { type: scalar.type as never }),
          ...(scalar.flavor !== undefined && { flavor: scalar.flavor as never }),
          ...(scalar.isAvailable !== undefined && { isAvailable: scalar.isAvailable }),
        },
      });
    }
  });
}

export async function deletePlateService(
  input: InferRequest<typeof DeletePlateContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);

  const plate = await prisma.plate.findUnique({
    where: { id: input.id },
    select: { creatorId: true },
  });
  if (!plate) throw ERR.NOT_FOUND(['id']);

  const caller = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const isOwner = plate.creatorId === userId;
  const isAuthority = caller?.role === 'AUTHORITY';
  if (!isOwner && !isAuthority) throw ERR.FORBIDDEN();

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.plate.delete({ where: { id: input.id } });

    if (plate.creatorId) {
      await tx.creatorStats.update({
        where: { userId: plate.creatorId },
        data: { totalPlates: { decrement: 1 } },
      });
    }
  });
}

//#endregion

//#region REVIEW SERVICES

export async function getMyReviewsService(
  input: InferRequest<typeof GetMyReviewsContract>,
  ctx: RequestContext,
): Promise<InferSuccess<typeof GetMyReviewsContract>> {
  const userId = requireSession(ctx);
  const { page, limit } = asPagination(input);

  type ReviewRow = {
    id: string;
    plateId: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
  };

  const [rows, total] = (await prisma.$transaction([
    prisma.review.findMany({
      where: { userId },
      select: { id: true, plateId: true, rating: true, comment: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where: { userId } }),
  ])) as [ReviewRow[], number];

  return {
    items: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    total,
  };
}

export async function getReviewService(
  input: InferRequest<typeof GetReviewContract>,
  ctx: RequestContext,
): Promise<InferSuccess<typeof GetReviewContract>> {
  const userId = requireSession(ctx);

  const row = await prisma.review.findUnique({
    where: { userId_plateId: { userId, plateId: input.plateId } },
    select: { id: true, plateId: true, rating: true, comment: true, createdAt: true },
  });
  if (!row) throw ERR.NOT_FOUND(['plateId']);

  return { ...row, createdAt: row.createdAt.toISOString() };
}

export async function createReviewService(
  input: InferRequest<typeof CreateReviewContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);
  const { plateId, rating, comment } = input;

  const plate = await prisma.plate.findUnique({
    where: { id: plateId },
    select: { id: true },
  });
  if (!plate) throw ERR.NOT_FOUND(['plateId']);

  const existing = await prisma.review.findUnique({
    where: { userId_plateId: { userId, plateId } },
    select: { id: true },
  });
  if (existing) throw ERR.ALREADY_EXISTS(['plateId']);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.review.create({ data: { userId, plateId, rating, comment } });
    await recalcPlateRating(plateId);
  });
}

export async function patchReviewService(
  input: InferRequest<typeof PatchReviewContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);
  const { plateId, rating, comment } = input;

  const existing = await prisma.review.findUnique({
    where: { userId_plateId: { userId, plateId } },
    select: { id: true },
  });
  if (!existing) throw ERR.NOT_FOUND(['plateId']);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.review.update({
      where: { userId_plateId: { userId, plateId } },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
      },
    });
    await recalcPlateRating(plateId);
  });
}

export async function deleteReviewService(
  input: InferRequest<typeof DeleteReviewContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);
  const { plateId } = input;

  const existing = await prisma.review.findUnique({
    where: { userId_plateId: { userId, plateId } },
    select: { id: true },
  });
  if (!existing) throw ERR.NOT_FOUND(['plateId']);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.review.delete({ where: { userId_plateId: { userId, plateId } } });
    await recalcPlateRating(plateId);
  });
}

//#endregion

//#region INGREDIENT SERVICES

export async function getIngredientsService(
  input: InferRequest<typeof GetIngredientsContract>,
): Promise<InferSuccess<typeof GetIngredientsContract>> {
  const { flavor } = input;
  const { page, limit } = asPagination(input);

  const where: Prisma.IngredientWhereInput = {
    isActive: true,
    ...(flavor !== undefined && { flavor }),
  };

  type IngredientRow = { id: string; name: string; flavor: string; isActive: boolean };

  const [rows, total] = (await prisma.$transaction([
    prisma.ingredient.findMany({
      where,
      select: { id: true, name: true, flavor: true, isActive: true },
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.ingredient.count({ where }),
  ])) as [IngredientRow[], number];

  return {
    items: rows.map((r) => ({ ...r, flavor: r.flavor as FlavorLiteral })),
    total,
  };
}

export async function getIngredientService(
  input: InferRequest<typeof GetIngredientContract>,
): Promise<InferSuccess<typeof GetIngredientContract>> {
  const row = await prisma.ingredient.findUnique({
    where: { id: input.id },
    select: { id: true, name: true, flavor: true, isActive: true },
  });
  if (!row) throw ERR.NOT_FOUND(['id']);

  return { ...row, flavor: row.flavor as FlavorLiteral };
}

export async function createIngredientService(
  input: InferRequest<typeof CreateIngredientContract>,
): Promise<void> {
  const existing = await prisma.ingredient.findUnique({
    where: { name: input.name },
    select: { id: true },
  });
  if (existing) throw ERR.ALREADY_EXISTS(['name']);

  await prisma.ingredient.create({
    data: { name: input.name, flavor: input.flavor as never },
  });
}

export async function updateIngredientService(
  input: InferRequest<typeof UpdateIngredientContract>,
): Promise<void> {
  const row = await prisma.ingredient.findUnique({
    where: { id: input.id },
    select: { id: true },
  });
  if (!row) throw ERR.NOT_FOUND(['id']);

  const conflict = await prisma.ingredient.findFirst({
    where: { name: input.name, id: { not: input.id } },
    select: { id: true },
  });
  if (conflict) throw ERR.ALREADY_EXISTS(['name']);

  await prisma.ingredient.update({
    where: { id: input.id },
    data: { name: input.name, flavor: input.flavor as never },
  });
}

export async function patchIngredientService(
  input: InferRequest<typeof PatchIngredientContract>,
): Promise<void> {
  const { id, name, flavor, isActive } = input;

  const row = await prisma.ingredient.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!row) throw ERR.NOT_FOUND(['id']);

  if (name !== undefined) {
    const conflict = await prisma.ingredient.findFirst({
      where: { name, id: { not: id } },
      select: { id: true },
    });
    if (conflict) throw ERR.ALREADY_EXISTS(['name']);
  }

  await prisma.ingredient.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(flavor !== undefined && { flavor: flavor as never }),
      ...(isActive !== undefined && { isActive: isActive }),
    },
  });
}

export async function deleteIngredientService(
  input: InferRequest<typeof DeleteIngredientContract>,
): Promise<void> {
  const row = await prisma.ingredient.findUnique({
    where: { id: input.id },
    select: { id: true },
  });
  if (!row) throw ERR.NOT_FOUND(['id']);

  const inUse = await prisma.plateIngredient.findFirst({
    where: { ingredientId: input.id },
    select: { plateId: true },
  });
  if (inUse) throw ERR.ALREADY_EXISTS(['id']);

  await prisma.ingredient.delete({ where: { id: input.id } });
}

//#endregion

//#region TAG SERVICES

export async function getTagsService(
  input: InferRequest<typeof GetTagsContract>,
): Promise<InferSuccess<typeof GetTagsContract>> {
  const { page, limit } = asPagination(input);

  type TagRow = {
    id: string;
    name: string;
    usageCount: number;
    isApproved: boolean;
    createdAt: Date;
  };

  const [rows, total] = (await prisma.$transaction([
    prisma.tag.findMany({
      where: { isApproved: true, isActive: true },
      select: { id: true, name: true, usageCount: true, isApproved: true, createdAt: true },
      orderBy: { usageCount: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.tag.count({ where: { isApproved: true, isActive: true } }),
  ])) as [TagRow[], number];

  return {
    items: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    total,
  };
}

export async function getTagService(
  input: InferRequest<typeof GetTagContract>,
): Promise<InferSuccess<typeof GetTagContract>> {
  const row = await prisma.tag.findUnique({
    where: { id: input.id },
    select: { id: true, name: true, usageCount: true, isApproved: true, createdAt: true },
  });
  if (!row) throw ERR.NOT_FOUND(['id']);

  return { ...row, createdAt: row.createdAt.toISOString() };
}

export async function proposeTagService(
  input: InferRequest<typeof ProposeTagContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);

  const existing = await prisma.tag.findUnique({
    where: { name: input.name },
    select: { id: true },
  });
  if (existing) throw ERR.ALREADY_EXISTS(['name']);

  await prisma.tag.create({
    data: { name: input.name, isApproved: false, createdById: userId },
  });
}

export async function patchTagService(
  input: InferRequest<typeof PatchTagContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);
  const { id, name } = input;

  const row = await prisma.tag.findUnique({
    where: { id },
    select: { createdById: true, isApproved: true },
  });
  if (!row) throw ERR.NOT_FOUND(['id']);
  if (row.createdById !== userId) throw ERR.FORBIDDEN();
  if (row.isApproved) throw ERR.FORBIDDEN();

  if (name !== undefined) {
    const conflict = await prisma.tag.findFirst({
      where: { name, id: { not: id } },
      select: { id: true },
    });
    if (conflict) throw ERR.ALREADY_EXISTS(['name']);
  }

  await prisma.tag.update({
    where: { id },
    data: { ...(name !== undefined && { name }) },
  });
}

export async function deleteTagService(
  input: InferRequest<typeof DeleteTagContract>,
  ctx: RequestContext,
): Promise<void> {
  const userId = requireSession(ctx);

  const row = await prisma.tag.findUnique({
    where: { id: input.id },
    select: { createdById: true, isApproved: true },
  });
  if (!row) throw ERR.NOT_FOUND(['id']);

  const caller = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const isOwnerOfPending = row.createdById === userId && !row.isApproved;
  const isAuthority = caller?.role === 'AUTHORITY';
  if (!isOwnerOfPending && !isAuthority) throw ERR.FORBIDDEN();

  await prisma.tag.delete({ where: { id: input.id } });
}

//#endregion
