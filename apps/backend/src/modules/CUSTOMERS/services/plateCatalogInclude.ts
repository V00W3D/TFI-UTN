import type { Prisma } from '../../../../prisma/generated/client';

/**
 * Include graph compartido para catálogo público (plato + receta + reseñas + tags).
 */
export const plateCatalogInclude = {
  recipe: {
    include: {
      items: {
        where: {
          variant: {
            isActive: true,
            ingredient: { isActive: true },
          },
        },
        orderBy: { sortOrder: 'asc' as const },
        include: {
          variant: {
            include: {
              ingredient: true,
            },
          },
        },
      },
    },
  },
  adjustments: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      recipeItem: {
        include: {
          variant: {
            include: {
              ingredient: true,
            },
          },
        },
      },
      variant: {
        include: {
          ingredient: true,
        },
      },
    },
  },
  reviews: {
    orderBy: { createdAt: 'desc' as const },
    include: {
      user: {
        select: { id: true, name: true, sname: true, lname: true, username: true },
      },
    },
  },
  tags: {
    where: {
      tag: { isActive: true },
    },
    include: {
      tag: true,
    },
  },
} satisfies Prisma.PlateInclude;

export type PlateCatalogRecord = Prisma.PlateGetPayload<{ include: typeof plateCatalogInclude }>;
