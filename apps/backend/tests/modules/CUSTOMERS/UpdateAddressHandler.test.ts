/**
 * @file UpdateAddressHandler.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for UpdateAddressHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: updated address payload, authenticated customer
 * outputs: updated address record
 * rules: requires authentication; delegates to service
 *
 * @technical
 * dependencies: vitest, UpdateAddressHandler, addressService
 * flow: mock service -> mock request -> call handler -> assert service call
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-UPDATE-ADDR-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UpdateAddressHandler } from '../../../src/modules/CUSTOMERS/handlers/UpdateAddressHandler';
import { updateAddressService } from '../../../src/modules/CUSTOMERS/services/addressService';
import { ERR } from '@app/sdk';

vi.mock('../../../src/tools/api', () => ({
  api: {
    // 2-curry: handler(id)(fn) => fn
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/addressService', () => ({
  updateAddressService: vi.fn(),
}));

describe('UpdateAddressHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-UPDATE-ADDR-01: lanza UNAUTHORIZED si no hay usuario en req', async () => {
    const mockCtx = { req: { cookies: {} } } as any;
    const input = { id: 'addr-1', street: 'New St' };

    await expect((UpdateAddressHandler as any)(input, mockCtx))
      .rejects.toThrowError(ERR.UNAUTHORIZED().message);
  });

  it('TC-H-UPDATE-ADDR-02: delega en updateAddressService si el usuario está autenticado', async () => {
    const mockUser = { id: 'usr-123' };
    const mockCtx = { req: { user: mockUser } } as any;
    const input = { id: 'addr-1', street: 'New St' };
    const mockResponse = { ...input, city: 'Old City' };

    vi.mocked(updateAddressService).mockResolvedValueOnce(mockResponse as any);

    const result = await (UpdateAddressHandler as any)(input, mockCtx);

    expect(updateAddressService).toHaveBeenCalledWith('usr-123', input);
    expect(result).toEqual(mockResponse);
  });
});
