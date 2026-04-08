/**
 * @file upsertReviewService.test.ts
 * @module Backend/Tests/CUSTOMERS
 * @description Tests unitarios para upsertReviewService.ts usando mocks de Prisma.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: userId, plateId, rating, comment, recommends
 * outputs: DTO de reseña mapeado o error si falla la consistencia
 * rules: plato debe existir y estar disponible; transaccional: upsert reseña + aggregate promedios + update plato; si falla cualquier paso → INTERNAL_ERROR
 *
 * @technical
 * dependencies: vitest, prisma (mocked), upsertReviewService, plateCatalogMap
 * flow: mockea db.plate.findFirst; mockea db.$transaction; mockea db.review methods; verifica flujo transaccional
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-REVIEW-01 a TC-REVIEW-03
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: el mock de $transaction ejecuta el callback inmediatamente con el mock de prisma para simular la tx
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ERROR_CODES } from '@app/sdk';

// ─────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────
vi.mock('../../../src/tools/db', () => ({
  prisma: {
    plate: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    review: {
      upsert: vi.fn(),
      aggregate: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { prisma } from '../../../src/tools/db';
import { upsertReviewService } from '../../../src/modules/CUSTOMERS/services/upsertReviewService';

const mockDb = prisma as unknown as {
  plate: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  review: {
    upsert: ReturnType<typeof vi.fn>;
    aggregate: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const mockPlate = { id: 'plate-1' };
const mockReviewResult = {
  id: 'review-1',
  userId: 'user-1',
  plateId: 'plate-1',
  rating: 5,
  comment: 'Top!',
  recommends: true,
  createdAt: new Date(),
  user: { id: 'user-1', username: 'victor' },
};

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────
describe('upsertReviewService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simular ejecución de transacción
    mockDb.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => fn(mockDb));
  });

  it('TC-REVIEW-01: crea/actualiza reseña exitosamente y actualiza el plato', async () => {
    mockDb.plate.findFirst.mockResolvedValue(mockPlate);
    mockDb.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 }, _count: 10 });
    mockDb.review.findUnique.mockResolvedValue(mockReviewResult);

    const result = await upsertReviewService({
      userId: 'user-1',
      plateId: 'plate-1',
      rating: 5,
      comment: 'Top!',
      recommends: true,
    });

    expect(result.rating).toBe(5);
    expect(mockDb.review.upsert).toHaveBeenCalled();
    expect(mockDb.plate.update).toHaveBeenCalledWith(expect.objectContaining({
      data: { avgRating: 4.5, ratingsCount: 10 }
    }));
  });

  it('TC-REVIEW-02: falla si el plato no existe o no está disponible (lanza NOT_FOUND)', async () => {
    mockDb.plate.findFirst.mockResolvedValue(null);

    await expect(
      upsertReviewService({
        userId: 'user-1',
        plateId: 'invalid-plate',
        rating: 1,
      }),
    ).rejects.toMatchObject({ 
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      params: ['plateId']
    });
  });

  it('TC-REVIEW-03: falla si la base de datos lanza un error inesperado (lanza INTERNAL)', async () => {
    mockDb.plate.findFirst.mockResolvedValue(mockPlate);
    mockDb.$transaction.mockRejectedValue(new Error('DB Boom'));

    await expect(
      upsertReviewService({
        userId: 'user-1',
        plateId: 'plate-1',
        rating: 5,
      }),
    ).rejects.toMatchObject({ 
      code: ERROR_CODES.INTERNAL_ERROR,
      params: ['DATABASE_ERROR']
    });
  });
});
