/**
 * @file getFeaturedPlatesService.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for featured plates recommendation algorithm.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: limit limit parameter
 * outputs: mapped array of featured plates
 * rules: rank plates based on units sold and rating math formula; fallback to highest rated if sales are not enough.
 *
 * @technical
 * dependencies: vitest, Prisma, getFeaturedPlatesService, mapPlateRecordToDto
 * flow: mock Prisma records -> execute service -> assert array constraints and sorting
 *
 * @estimation
 * complexity: Medium
 * fpa: ILF
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-B-FEATURED-01 to TC-B-FEATURED-02
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 * decisions: focuses on algorithm grouping and score sorting accuracy.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getFeaturedPlatesService } from '../../../src/modules/CUSTOMERS/services/getFeaturedPlatesService';
import { prisma } from '../../../src/tools/db';
import { ERR } from '@app/sdk';
import { mapPlateRecordToDto } from '../../../src/modules/CUSTOMERS/services/plateCatalogMap';

vi.mock('../../../src/tools/db', () => ({
  prisma: {
    saleItem: {
      groupBy: vi.fn(),
    },
    plate: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/plateCatalogMap', () => ({
  mapPlateRecordToDto: vi.fn((plate) => ({ ...plate, mapped: true })),
}));

describe('getFeaturedPlatesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPlate1 = {
    id: 'p1',
    ratingsCount: 10,
    avgRating: 4.5,
  };

  const mockPlate2 = {
    id: 'p2',
    ratingsCount: 0,
    avgRating: 0,
  };

  const mockPlate3 = {
    id: 'p3',
    ratingsCount: 5,
    avgRating: 5.0,
  };

  it('TC-B-FEATURED-01: calcula scores correctamente combinando ventas y reviews, limitando salida', async () => {
    vi.mocked(prisma.saleItem.groupBy).mockResolvedValueOnce([
      { plateId: 'p2', _sum: { quantity: 100 } }, // Muchas ventas, sin rating
      { plateId: 'p1', _sum: { quantity: 10 } },  // Ventas medias, buen rating
    ] as any);

    vi.mocked(prisma.plate.findMany).mockResolvedValueOnce([
      mockPlate1, mockPlate2, mockPlate3,
    ] as any);

    // Limit 2 should return top 2
    const res = await getFeaturedPlatesService({ limit: 2 });
    
    expect(res).toHaveLength(2);
    // p2 = 100 * 12 = 1200
    // p1 = 10 * 12 + (4.5 * log10(11) * 4) = 120 + 18.7 = 138.7
    // p3 = 0 * 12 + (5.0 * log10(6) * 4) = 15.5
    expect(res[0].id).toBe('p2');
    expect(res[1].id).toBe('p1');
    
    // Properties assertion
    expect(res[0]).toHaveProperty('mapped', true);
    expect(res[0]).toHaveProperty('unitsSold', 100);
    expect(res[1]).toHaveProperty('unitsSold', 10);
  });

  it('TC-B-FEATURED-02: si no hay suficientes con ventas, hace fallback y rellena con los mejores rated', async () => {
    // Ninguna venta
    vi.mocked(prisma.saleItem.groupBy).mockResolvedValueOnce([]);

    vi.mocked(prisma.plate.findMany).mockResolvedValueOnce([
      mockPlate1, mockPlate2, mockPlate3,
    ] as any);

    const res = await getFeaturedPlatesService({ limit: 3 });
    expect(res).toHaveLength(3);
    
    // p3 -> 5.0, 5 reviews (Score alg or Fallback alg should pick it first among ties or empty)
    // Both algorithms prioritize higher rating
    expect(res[0].id).toBe('p1'); // p1 has score: 4.5 * log10(11)*4 = ~18.7
                                 // p3 has score: 5.0 * log10(6)*4 = ~15.5
    expect(res[1].id).toBe('p3');
    expect(res[2].id).toBe('p2'); // 0 score
  });

  it('TC-B-FEATURED-03: envuelve errores en DATABASE_ERROR', async () => {
    vi.mocked(prisma.saleItem.groupBy).mockRejectedValueOnce(new Error('Crash'));
    await expect(getFeaturedPlatesService({ limit: 5 })).rejects.toThrowError(ERR.INTERNAL(['DATABASE_ERROR']).message);
  });
});
