/**
 * @file LogoutHandler.test.ts
 * @module IAM/Tests
 * @description Unit tests for LogoutHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-03
 * rnf: RNF-05
 *
 * @business
 * inputs: none
 * outputs: none (sets clearCookie headers)
 * rules: clears session cookies (accessToken/refreshToken) with matching security flags
 *
 * @technical
 * dependencies: vitest, LogoutHandler
 * flow: mock response -> call handler -> assert clearCookie calls
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-LOGOUT-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { LogoutHandler } from '../../../src/modules/IAM/handlers/LogoutHandler';

vi.mock('../../../src/tools/api', () => ({
  api: {
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/env', () => ({
  BUN_MODE: 'dev',
}));

describe('LogoutHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-LOGOUT-01: limpia las cookies de sesion', async () => {
    const mockRes = { clearCookie: vi.fn() };
    const mockCtx = { res: mockRes } as any;

    await (LogoutHandler as any)({}, mockCtx);

    expect(mockRes.clearCookie).toHaveBeenCalledWith('CupCake', expect.any(Object));
    expect(mockRes.clearCookie).toHaveBeenCalledWith('Cake', expect.any(Object));
  });
});
