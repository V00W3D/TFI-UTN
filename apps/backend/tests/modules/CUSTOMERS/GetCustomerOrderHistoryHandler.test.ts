/**
 * @file GetCustomerOrderHistoryHandler.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for GetCustomerOrderHistoryHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-20
 * rnf: RNF-03
 *
 * @business
 * inputs: optional customer auth
 * outputs: list of past order records
 * rules: uses optional user context; delegates to service
 *
 * @technical
 * dependencies: vitest, GetCustomerOrderHistoryHandler, readOptionalUserId, getCustomerOrderHistoryService
 * flow: mock service and utility -> call handler -> assert service call with mapped context
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-GET-ORDER-HISTORY-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GetCustomerOrderHistoryHandler } from '../../../src/modules/CUSTOMERS/handlers/GetCustomerOrderHistoryHandler';
import { getCustomerOrderHistoryService } from '../../../src/modules/CUSTOMERS/services/getCustomerOrderHistoryService';
import { readOptionalUserId } from '../../../src/tools/optionalUser';

vi.mock('../../../src/tools/api', () => ({
  api: {
    // 2-curry: handler(id)(fn) => fn
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/CUSTOMERS/services/getCustomerOrderHistoryService', () => ({
  getCustomerOrderHistoryService: vi.fn(),
}));

vi.mock('../../../src/tools/optionalUser', () => ({
  readOptionalUserId: vi.fn(),
}));

describe('GetCustomerOrderHistoryHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-GET-ORDER-HISTORY-01: lee el userId opcional y delega en el servicio', async () => {
    const mockCtx = { req: { cookies: {} } } as any;
    const mockResponse = [{ id: 'order-1' }];

    vi.mocked(readOptionalUserId).mockReturnValueOnce('usr-any');
    vi.mocked(getCustomerOrderHistoryService).mockResolvedValueOnce(mockResponse as any);

    const result = await (GetCustomerOrderHistoryHandler as any)({}, mockCtx);

    expect(readOptionalUserId).toHaveBeenCalledWith(mockCtx.req);
    expect(getCustomerOrderHistoryService).toHaveBeenCalledWith({ customerUserId: 'usr-any' });
    expect(result).toEqual(mockResponse);
  });
});
