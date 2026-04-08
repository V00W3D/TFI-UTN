/**
 * @file plateCatalogInclude.ts
 * @module CUSTOMERS
 * @description Archivo plateCatalogInclude alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-02
 * rnf: RNF-02
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
