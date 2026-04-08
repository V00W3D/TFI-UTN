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
 * inputs: payloads tipados, ids autenticados, helpers compartidos y acceso a Prisma cuando aplica
 * outputs: datos de dominio listos para contrato, mutaciones persistidas o payloads auxiliares
 * rules: normalizar datos, validar reglas de dominio y preservar consistencia transaccional
 *
 * @technical
 * dependencies: client
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
