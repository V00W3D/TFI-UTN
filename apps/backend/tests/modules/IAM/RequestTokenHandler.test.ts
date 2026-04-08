/**
 * @file RequestTokenHandler.test.ts
 * @module IAM/Tests
 * @description Unit tests for RequestTokenHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-06
 * rnf: RNF-02
 *
 * @business
 * inputs: token request purpose (validated via api.handler), authenticated user
 * outputs: none (async completion)
 * rules: requires authentication; delegates token generation to Service
 *
 * @technical
 * dependencies: vitest, RequestTokenHandler, requestTokenService
 * flow: mock service -> mock ctx -> call handler -> assert delegation or auth error
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-REQ-TOKEN-01, TC-H-REQ-TOKEN-02
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { RequestTokenHandler } from '../../../src/modules/IAM/handlers/RequestTokenHandler';
import { requestTokenService } from '../../../src/modules/IAM/services/requestTokenService';
import { ERR } from '@app/sdk';

vi.mock('../../../src/tools/api', () => ({
  api: {
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/IAM/services/requestTokenService', () => ({
  requestTokenService: vi.fn(),
}));

describe('RequestTokenHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-REQ-TOKEN-01: lanza UNAUTHORIZED si no hay usuario', async () => {
    const mockCtx = { req: {} } as any;
    await expect((RequestTokenHandler as any)({ purpose: 'email_verification' }, mockCtx))
      .rejects.toThrowError(ERR.UNAUTHORIZED().message);
  });

  it('TC-H-REQ-TOKEN-02: delega en requestTokenService con userId e input', async () => {
    const mockUser = { id: 'usr-456' };
    const mockCtx = { req: { user: mockUser } } as any;
    const input = { purpose: 'email_verification' as const };

    await (RequestTokenHandler as any)(input, mockCtx);

    expect(requestTokenService).toHaveBeenCalledWith('usr-456', input);
  });
});
