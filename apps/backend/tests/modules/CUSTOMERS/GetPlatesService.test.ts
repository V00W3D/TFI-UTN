/**
 * @file GetPlatesService.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for retrieving the public active plate catalog.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: null
 * outputs: mapped array of active catalog plates
 * rules: plate must be available and its recipe active
 *
 * @technical
 * dependencies: vitest, Prisma, getPlatesService, mapPlateRecordToDto
 * flow: mock Prisma records -> execute service -> assert mapping logic and DB crash catching
 *
 * @estimation
 * complexity: Low
 * fpa: ILF
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-B-GET-PLATES-01
 * ultima prueba exitosa: 2026-04-08 14:10:00
 *
 * @notes
 * decisions: validates where conditions sent to Prisma and correct mapper binding.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getPlatesService } from '../../../src/modules/CUSTOMERS/services/GetPlatesService';
import { prisma } from '../../../src/tools/db';
import { ERR } from '@app/sdk';
import { mapPlateRecordToDto } from '../../../src/modules/CUSTOMERS/services/plateCatalogMap';

vi.mock('../../../src/tools/db', () => ({
  prisma: {
    plate: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/plateCatalogMap', () => ({
  mapPlateRecordToDto: vi.fn((plate) => ({ ...plate, isMapped: true })),
}));

describe('getPlatesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-B-GET-PLATES-01: consulta platos activos y delega en el mapper', async () => {
    vi.mocked(prisma.plate.findMany).mockResolvedValueOnce([
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ] as any);

    const res = await getPlatesService();

    expect(prisma.plate.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        isAvailable: true,
        recipe: { isActive: true },
      },
      orderBy: expect.arrayContaining([
        { likesCount: 'desc' },
        { avgRating: 'desc' },
        { name: 'asc' }
      ]),
    }));

    expect(mapPlateRecordToDto).toHaveBeenCalledTimes(2);
    expect(res).toHaveLength(2);
    expect(res[0]).toHaveProperty('isMapped', true);
  });

  it('TC-B-GET-PLATES-02: envuelve fallos de base de datos en AppError', async () => {
    vi.mocked(prisma.plate.findMany).mockRejectedValueOnce(new Error('crash'));
    await expect(getPlatesService()).rejects.toThrowError(ERR.INTERNAL(['DATABASE_ERROR']).message);
  });
});
