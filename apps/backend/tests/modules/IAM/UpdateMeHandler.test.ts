/**
 * @file UpdateMeHandler.test.ts
 * @module IAM/Tests
 * @description Unit tests for UpdateMeHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-05
 * rnf: RNF-05
 *
 * @business
 * inputs: partial user update payload, authenticated user
 * outputs: updated user identity
 * rules: requires authentication; delegates update to Service; re-issues cookies with updated info
 *
 * @technical
 * dependencies: vitest, UpdateMeHandler, updateMeService, issueAuthCookies
 * flow: mock service and helpers -> call handler -> assert delegation and data flow
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-UPDATE-ME-01, TC-H-UPDATE-ME-02
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UpdateMeHandler } from '../../../src/modules/IAM/handlers/UpdateMeHandler';
import { updateMeService } from '../../../src/modules/IAM/services/UpdateMeService';
import { issueAuthCookies } from '../../../src/modules/IAM/services/issueAuthCookies';
import { ERR } from '@app/sdk';

vi.mock('../../../src/tools/api', () => ({
  api: {
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/IAM/services/UpdateMeService', () => ({
  updateMeService: vi.fn(),
}));

vi.mock('../../../src/modules/IAM/services/issueAuthCookies', () => ({
  issueAuthCookies: vi.fn(),
}));

describe('UpdateMeHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-UPDATE-ME-01: lanza UNAUTHORIZED si no hay usuario', async () => {
    const mockCtx = { req: {}, res: {} } as any;
    await expect((UpdateMeHandler as any)({ name: 'New Name' }, mockCtx))
      .rejects.toThrowError(ERR.UNAUTHORIZED().message);
  });

  it('TC-H-UPDATE-ME-02: delega en service y re-emite cookies', async () => {
    const mockUser = { id: 'usr-123' };
    const mockRes = {};
    const mockCtx = { req: { user: mockUser }, res: mockRes } as any;
    const input = { name: 'New Name' };
    const mockUpdatedUser = { ...mockUser, name: 'New Name' };

    vi.mocked(updateMeService).mockResolvedValueOnce(mockUpdatedUser as any);

    const result = await (UpdateMeHandler as any)(input, mockCtx);

    expect(updateMeService).toHaveBeenCalledWith('usr-123', input);
    expect(issueAuthCookies).toHaveBeenCalledWith(mockRes, mockUpdatedUser);
    expect(result).toEqual(mockUpdatedUser);
  });
});
