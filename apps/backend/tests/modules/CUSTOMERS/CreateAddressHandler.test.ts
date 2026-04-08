/**
 * @file CreateAddressHandler.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for CreateAddressHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: address payload, authenticated customer
 * outputs: created address record
 * rules: requires authentication; delegates to service
 *
 * @technical
 * dependencies: vitest, CreateAddressHandler, addressService
 * flow: mock service -> mock request -> call handler -> assert service call
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-CREATE-ADDR-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreateAddressHandler } from '../../../src/modules/CUSTOMERS/handlers/CreateAddressHandler';
import { createAddressService } from '../../../src/modules/CUSTOMERS/services/addressService';
import { ERR } from '@app/sdk';

// Mock the API wrapper to just return the inner handler function
vi.mock('../../../src/tools/api', () => ({
  api: {
    // 2-curry: handler(id)(fn) => fn
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/addressService', () => ({
  createAddressService: vi.fn(),
}));

describe('CreateAddressHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-CREATE-ADDR-01: lanza UNAUTHORIZED si no hay usuario en req', async () => {
    const mockCtx = { req: { cookies: {} } } as any;
    const input = { street: 'Main', city: 'City' };

    await expect((CreateAddressHandler as any)(input, mockCtx))
      .rejects.toThrowError(ERR.UNAUTHORIZED().message);
  });

  it('TC-H-CREATE-ADDR-02: delega en createAddressService si el usuario está autenticado', async () => {
    const mockUser = { id: 'usr-123' };
    const mockCtx = { req: { user: mockUser } } as any;
    const input = { street: 'Main', city: 'City', alias: 'Home' };
    const mockResponse = { id: 'addr-1', ...input };

    vi.mocked(createAddressService).mockResolvedValueOnce(mockResponse as any);

    const result = await (CreateAddressHandler as any)(input, mockCtx);

    expect(createAddressService).toHaveBeenCalledWith('usr-123', input);
    expect(result).toEqual(mockResponse);
  });
});
