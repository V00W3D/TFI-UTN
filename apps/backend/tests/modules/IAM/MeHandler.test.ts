/**
 * @file MeHandler.test.ts
 * @module IAM/Tests
 * @description Unit tests for MeHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-05
 * rnf: RNF-05
 *
 * @business
 * inputs: current session context (req)
 * outputs: authenticated subject identity
 * rules: delegates extraction to MeService
 *
 * @technical
 * dependencies: vitest, MeHandler, MeService
 * flow: mock service -> mock ctx -> call handler -> assert delegation
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-ME-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MeHandler } from '../../../src/modules/IAM/handlers/MeHandler';
import { meService } from '../../../src/modules/IAM/services/MeService';

vi.mock('../../../src/tools/api', () => ({
  api: {
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/IAM/services/MeService', () => ({
  meService: vi.fn(),
}));

describe('MeHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-ME-01: delega en meService pasandole el req', async () => {
    const mockReq = { user: { id: 'usr-123' } };
    const mockCtx = { req: mockReq } as any;
    const mockResponse = { id: 'usr-123', email: 'me@test.com' };

    vi.mocked(meService).mockResolvedValueOnce(mockResponse as any);

    const result = await (MeHandler as any)({}, mockCtx);

    expect(meService).toHaveBeenCalledWith(mockReq);
    expect(result).toEqual(mockResponse);
  });
});
