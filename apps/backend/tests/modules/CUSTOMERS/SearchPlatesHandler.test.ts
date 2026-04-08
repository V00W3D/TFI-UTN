/**
 * @file SearchPlatesHandler.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for SearchPlatesHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: SearchPlatesQuery payload
 * outputs: search results (plates and pagination)
 * rules: delegates to searchPlatesService
 *
 * @technical
 * dependencies: vitest, SearchPlatesHandler, searchPlatesService
 * flow: mock service -> call handler -> assert service call with input
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-SEARCH-PLATES-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SearchPlatesHandler } from '../../../src/modules/CUSTOMERS/handlers/SearchPlatesHandler';
import { searchPlatesService } from '../../../src/modules/CUSTOMERS/services/searchPlatesService';

vi.mock('../../../src/tools/api', () => ({
  api: {
    // 2-curry: handler(id)(fn) => fn
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/searchPlatesService', () => ({
  searchPlatesService: vi.fn(),
}));

describe('SearchPlatesHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-SEARCH-PLATES-01: delega en searchPlatesService con el input recibido', async () => {
    const input = { q: 'pizza', sort: 'price_asc' };
    const mockResponse = { items: [], total: 0 };

    vi.mocked(searchPlatesService).mockResolvedValueOnce(mockResponse as any);

    const result = await (SearchPlatesHandler as any)(input);

    expect(searchPlatesService).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
  });
});
