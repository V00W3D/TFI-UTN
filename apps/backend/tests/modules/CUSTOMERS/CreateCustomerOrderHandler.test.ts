/**
 * @file CreateCustomerOrderHandler.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for CreateCustomerOrderHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: order payload, optional customer auth
 * outputs: created order records
 * rules: uses optional user context; delegates to service
 *
 * @technical
 * dependencies: vitest, CreateCustomerOrderHandler, readOptionalUserId, createCustomerOrderService
 * flow: mock service and utility -> call handler -> assert service call with mapped context
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-CREATE-ORDER-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreateCustomerOrderHandler } from '../../../src/modules/CUSTOMERS/handlers/CreateCustomerOrderHandler';
import { createCustomerOrderService } from '../../../src/modules/CUSTOMERS/services/createCustomerOrderService';
import { readOptionalUserId } from '../../../src/tools/optionalUser';

vi.mock('../../../src/tools/api', () => ({
  api: {
    // 2-curry: handler(id)(fn) => fn
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/createCustomerOrderService', () => ({
  createCustomerOrderService: vi.fn(),
}));

vi.mock('../../../src/tools/optionalUser', () => ({
  readOptionalUserId: vi.fn(),
}));

describe('CreateCustomerOrderHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-CREATE-ORDER-01: lee el userId opcional y delega en el servicio', async () => {
    const mockCtx = { req: { cookies: {} } } as any;
    const input = { items: [{ plateId: 'p1', quantity: 1 }], fulfillment: 'pickup' };
    const mockResponse = { id: 'order-123' };

    vi.mocked(readOptionalUserId).mockReturnValueOnce('usr-789');
    vi.mocked(createCustomerOrderService).mockResolvedValueOnce(mockResponse as any);

    const result = await (CreateCustomerOrderHandler as any)(input, mockCtx);

    expect(readOptionalUserId).toHaveBeenCalledWith(mockCtx.req);
    expect(createCustomerOrderService).toHaveBeenCalledWith(input, { customerUserId: 'usr-789' });
    expect(result).toEqual(mockResponse);
  });
});
