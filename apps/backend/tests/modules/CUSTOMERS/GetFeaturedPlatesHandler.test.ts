/**
 * @file GetFeaturedPlatesHandler.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for GetFeaturedPlatesHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: limit for featured plates
 * outputs: list of featured plate records
 * rules: delegates to service
 *
 * @technical
 * dependencies: vitest, GetFeaturedPlatesHandler, getFeaturedPlatesService
 * flow: mock service -> call handler -> assert service call with limit
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-FEATURED-PLATES-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GetFeaturedPlatesHandler } from '../../../src/modules/CUSTOMERS/handlers/GetFeaturedPlatesHandler';
import { getFeaturedPlatesService } from '../../../src/modules/CUSTOMERS/services/getFeaturedPlatesService';

vi.mock('../../../src/tools/api', () => ({
  api: {
    // 2-curry: handler(id)(fn) => fn
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/getFeaturedPlatesService', () => ({
  getFeaturedPlatesService: vi.fn(),
}));

describe('GetFeaturedPlatesHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-FEATURED-PLATES-01: delega en getFeaturedPlatesService con el limit recibido', async () => {
    const input = { limit: 5 };
    const mockResponse = [{ id: 'plate-1' }];

    vi.mocked(getFeaturedPlatesService).mockResolvedValueOnce(mockResponse as any);

    const result = await (GetFeaturedPlatesHandler as any)(input);

    expect(getFeaturedPlatesService).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
  });
});
