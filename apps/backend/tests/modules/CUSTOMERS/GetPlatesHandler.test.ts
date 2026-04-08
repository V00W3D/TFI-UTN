/**
 * @file GetPlatesHandler.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for GetPlatesHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: none
 * outputs: full catalog of plates
 * rules: delegates to service
 *
 * @technical
 * dependencies: vitest, GetPlatesHandler, getPlatesService
 * flow: mock service -> call handler -> assert service call
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-GET-PLATES-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GetPlatesHandler } from '../../../src/modules/CUSTOMERS/handlers/GetPlatesHandler';
import { getPlatesService } from '../../../src/modules/CUSTOMERS/services/GetPlatesService';

vi.mock('../../../src/tools/api', () => ({
  api: {
    // 2-curry: handler(id)(fn) => fn
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/GetPlatesService', () => ({
  getPlatesService: vi.fn(),
}));

describe('GetPlatesHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-GET-PLATES-01: delega en getPlatesService', async () => {
    const mockResponse = [{ id: 'plate-1' }];
    vi.mocked(getPlatesService).mockResolvedValueOnce(mockResponse as any);

    const result = await (GetPlatesHandler as any)();

    expect(getPlatesService).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });
});
