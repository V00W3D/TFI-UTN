/**
 * @file searchPlatesService.test.ts
 * @module Backend/Tests/CUSTOMERS
 * @description Tests unitarios para searchPlatesService.ts usando mocks de Prisma.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: parámetros de búsqueda (q, price, nutrition, tags, sorting, pagination)
 * outputs: lista paginada de platos mapeados y total de resultados
 * rules: filtrar por disponibilidad; aplicar filtros opcionales (precio, calorías, etc.); construir cláusulas AND/OR/NOT precisas; aplicar ordenamiento solicitado; retornar DTOs consistentes
 *
 * @technical
 * dependencies: vitest, prisma (mocked), searchPlatesService, plateCatalogMap
 * flow: mockea prisma.plate.count; mockea prisma.plate.findMany con include; ejecuta servicio; verifica que las cláusulas WHERE y ORDER BY sean correctas
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-SEARCH-01 a TC-SEARCH-06
 * ultima prueba exitosa: 2026-04-08 12:40:15
 *
 * @notes
 * decisions: se utiliza un mock parcial profundo de PlateCatalogRecord para satisfacer las dependencias del mapeador
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Prisma } from '../../../prisma/generated/client';

// ─────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────
vi.mock('../../../src/tools/db', () => ({
  prisma: {
    plate: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '../../../src/tools/db';
import { searchPlatesService } from '../../../src/modules/CUSTOMERS/services/searchPlatesService';

const mockPrisma = prisma as unknown as {
  plate: { 
    count: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const buildMockPlate = (id: string, name: string) => ({
  id,
  name,
  description: 'Desc',
  imageUrl: null,
  size: 'MEDIUM',
  servedWeightGrams: 500,
  menuPrice: new Prisma.Decimal(1200),
  costPrice: new Prisma.Decimal(800),
  avgRating: 4.5,
  ratingsCount: 10,
  likesCount: 5,
  dislikesCount: 1,
  isAvailable: true,
  allergens: [],
  dietaryTags: [],
  nutritionTags: [],
  nutritionNotes: null,
  calculatedCalories: 450,
  calculatedProteins: 25,
  calculatedFats: 15,
  recipe: {
    id: `rec-${id}`,
    name: `Recipe ${name}`,
    description: null,
    type: 'MAIN',
    flavor: 'SAVORY',
    difficulty: 'MEDIUM',
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    yieldServings: 2,
    assemblyNotes: null,
    allergens: [],
    dietaryTags: [],
    items: [],
  },
  adjustments: [],
  reviews: [],
  tags: [],
});

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────
describe('searchPlatesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-SEARCH-01: aplica filtros básicos (q, price, availability)', async () => {
    mockPrisma.plate.count.mockResolvedValue(1);
    mockPrisma.plate.findMany.mockResolvedValue([buildMockPlate('1', 'Pasta Carbonara')]);

    const result = await searchPlatesService({
      q: 'pasta',
      minPrice: 1000,
      maxPrice: 2000,
      page: 1,
      pageSize: 10,
    });

    expect(result.total).toBe(1);
    expect(result.items[0]?.name).toBe('Pasta Carbonara');

    // Verificar cláusulas WHERE
    const findManyCall = mockPrisma.plate.findMany.mock.calls[0]?.[0];
    const where = findManyCall.where.AND;

    // Disponibilidad
    expect(where).toContainEqual({ isAvailable: true });
    expect(where).toContainEqual({ recipe: { isActive: true } });
    
    // Búsqueda textual
    expect(where).toContainEqual(expect.objectContaining({
      OR: expect.arrayContaining([
        expect.objectContaining({ name: { contains: 'pasta', mode: 'insensitive' } })
      ])
    }));

    // Precio
    expect(where).toContainEqual({ menuPrice: { gte: 1000, lte: 2000 } });
  });

  it('TC-SEARCH-02: aplica filtros nutricionales y de tiempo', async () => {
    mockPrisma.plate.count.mockResolvedValue(0);
    mockPrisma.plate.findMany.mockResolvedValue([]);

    await searchPlatesService({
      minCalories: 300,
      maxCalories: 600,
      maxPrepMinutes: 15,
      page: 1,
      pageSize: 10,
    });

    const where = mockPrisma.plate.findMany.mock.calls[0]?.[0].where.AND;
    expect(where).toContainEqual({ calculatedCalories: { gte: 300, lte: 600 } });
    expect(where).toContainEqual({
      recipe: expect.objectContaining({
        OR: [{ prepTimeMinutes: { lte: 15 } }, { prepTimeMinutes: null }]
      })
    });
  });

  it('TC-SEARCH-03: aplica filtros de tags y alérgenos', async () => {
    mockPrisma.plate.count.mockResolvedValue(0);
    mockPrisma.plate.findMany.mockResolvedValue([]);

    await searchPlatesService({
      dietaryTags: ['VEGAN'],
      excludeAllergens: ['GLUTEN'],
      page: 1,
      pageSize: 10,
    });

    const where = mockPrisma.plate.findMany.mock.calls[0]?.[0].where.AND;
    expect(where).toContainEqual({ dietaryTags: { has: 'VEGAN' } });
    expect(where).toContainEqual({
      NOT: { allergens: { hasSome: ['GLUTEN'] } }
    });
  });

  it('TC-SEARCH-04: aplica ordenamiento por precio ascendente', async () => {
    mockPrisma.plate.count.mockResolvedValue(0);
    mockPrisma.plate.findMany.mockResolvedValue([]);

    await searchPlatesService({
      sort: 'price_asc',
      page: 1,
      pageSize: 10,
    });

    const findManyCall = mockPrisma.plate.findMany.mock.calls[0]?.[0];
    expect(findManyCall.orderBy).toEqual({ menuPrice: 'asc' });
  });

  it('TC-SEARCH-05: maneja paginación correctamente', async () => {
    mockPrisma.plate.count.mockResolvedValue(25);
    mockPrisma.plate.findMany.mockResolvedValue([]);

    await searchPlatesService({
      page: 3,
      pageSize: 5,
    });

    const findManyCall = mockPrisma.plate.findMany.mock.calls[0]?.[0];
    expect(findManyCall.skip).toBe(10);
    expect(findManyCall.take).toBe(5);
  });

  it('TC-SEARCH-06: falla con INTERNAL_ERROR si Prisma lanza excepción', async () => {
    mockPrisma.plate.count.mockRejectedValue(new Error('DB Error'));

    await expect(
      searchPlatesService({ page: 1, pageSize: 10 })
    ).rejects.toMatchObject({ code: 'INTERNAL_ERROR' });
  });
});
