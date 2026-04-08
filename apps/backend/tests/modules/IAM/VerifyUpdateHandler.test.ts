/**
 * @file VerifyUpdateHandler.test.ts
 * @module IAM/Tests
 * @description Unit tests for VerifyUpdateHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-06
 * rnf: RNF-02
 *
 * @business
 * inputs: verification token payload, authenticated user
 * outputs: updated user identity
 * rules: requires authentication; delegates verification to Service; re-issues cookies with updated info
 *
 * @technical
 * dependencies: vitest, VerifyUpdateHandler, verifyUpdateService, issueAuthCookies
 * flow: mock service and helpers -> call handler -> assert delegation and data flow
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-VERIFY-UPDATE-01, TC-H-VERIFY-UPDATE-02
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { VerifyUpdateHandler } from '../../../src/modules/IAM/handlers/VerifyUpdateHandler';
import { verifyUpdateService } from '../../../src/modules/IAM/services/verifyUpdateService';
import { issueAuthCookies } from '../../../src/modules/IAM/services/issueAuthCookies';
import { ERR } from '@app/sdk';

vi.mock('../../../src/tools/api', () => ({
  api: {
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/IAM/services/verifyUpdateService', () => ({
  verifyUpdateService: vi.fn(),
}));

vi.mock('../../../src/modules/IAM/services/issueAuthCookies', () => ({
  issueAuthCookies: vi.fn(),
}));

describe('VerifyUpdateHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-VERIFY-UPDATE-01: lanza UNAUTHORIZED si no hay usuario', async () => {
    const mockCtx = { req: {}, res: {} } as any;
    await expect((VerifyUpdateHandler as any)({ token: 'abc' }, mockCtx))
      .rejects.toThrowError(ERR.UNAUTHORIZED().message);
  });

  it('TC-H-VERIFY-UPDATE-02: delega en service y re-emite cookies', async () => {
    const mockUser = { id: 'usr-123' };
    const mockRes = {};
    const mockCtx = { req: { user: mockUser }, res: mockRes } as any;
    const input = { token: 'abc' };
    const mockUpdatedUser = { ...mockUser, emailVerified: true };

    vi.mocked(verifyUpdateService).mockResolvedValueOnce(mockUpdatedUser as any);

    const result = await (VerifyUpdateHandler as any)(input, mockCtx);

    expect(verifyUpdateService).toHaveBeenCalledWith('usr-123', input);
    expect(issueAuthCookies).toHaveBeenCalledWith(mockRes, mockUpdatedUser);
    expect(result).toEqual(mockUpdatedUser);
  });
});
