/**
 * @file GetAddressesHandler.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for GetAddressesHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: authenticated customer id
 * outputs: list of address records
 * rules: requires authentication; delegates to service
 *
 * @technical
 * dependencies: vitest, GetAddressesHandler, addressService
 * flow: mock service -> mock request -> call handler -> assert service call
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-GET-ADDR-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GetAddressesHandler } from '../../../src/modules/CUSTOMERS/handlers/GetAddressesHandler';
import { getAddressesService } from '../../../src/modules/CUSTOMERS/services/addressService';
import { ERR } from '@app/sdk';

vi.mock('../../../src/tools/api', () => ({
  api: {
    // 2-curry: handler(id)(fn) => fn
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/addressService', () => ({
  getAddressesService: vi.fn(),
}));

describe('GetAddressesHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-GET-ADDR-01: lanza UNAUTHORIZED si no hay usuario en req', async () => {
    const mockCtx = { req: { cookies: {} } } as any;
    await expect((GetAddressesHandler as any)({}, mockCtx))
      .rejects.toThrowError(ERR.UNAUTHORIZED().message);
  });

  it('TC-H-GET-ADDR-02: delega en getAddressesService si el usuario está autenticado', async () => {
    const mockUser = { id: 'usr-123' };
    const mockCtx = { req: { user: mockUser } } as any;
    const mockResponse = [{ id: 'addr-1', street: 'Main' }];

    vi.mocked(getAddressesService).mockResolvedValueOnce(mockResponse as any);

    const result = await (GetAddressesHandler as any)({}, mockCtx);

    expect(getAddressesService).toHaveBeenCalledWith('usr-123');
    expect(result).toEqual(mockResponse);
  });
});
