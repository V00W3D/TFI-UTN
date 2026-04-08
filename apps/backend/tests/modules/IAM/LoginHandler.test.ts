/**
 * @file LoginHandler.test.ts
 * @module IAM/Tests
 * @description Unit tests for LoginHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-02
 * rnf: RNF-02
 *
 * @business
 * inputs: login credentials (validated by Zod via api.handler)
 * outputs: authenticated user identity
 * rules: authenticates user via service; issues secure cookies via helper
 *
 * @technical
 * dependencies: vitest, LoginHandler, loginService, issueAuthCookies
 * flow: mock service and cookie helper -> call handler -> assert delegation and data flow
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-LOGIN-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { LoginHandler } from '../../../src/modules/IAM/handlers/LoginHandler';
import { loginService } from '../../../src/modules/IAM/services/LoginService';
import { issueAuthCookies } from '../../../src/modules/IAM/services/issueAuthCookies';

vi.mock('../../../src/tools/api', () => ({
  api: {
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/IAM/services/LoginService', () => ({
  loginService: vi.fn(),
}));

vi.mock('../../../src/modules/IAM/services/issueAuthCookies', () => ({
  issueAuthCookies: vi.fn(),
}));

describe('LoginHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-LOGIN-01: delega en loginService y emite cookies', async () => {
    const input = { email: 'test@qart.com', password: 'password123' };
    const mockUser = { id: 'usr-1', email: 'test@qart.com' };
    const mockCtx = { res: {} as any } as any;

    vi.mocked(loginService).mockResolvedValueOnce(mockUser as any);

    const result = await (LoginHandler as any)(input, mockCtx);

    expect(loginService).toHaveBeenCalledWith(input);
    expect(issueAuthCookies).toHaveBeenCalledWith(mockCtx.res, mockUser);
    expect(result).toEqual(mockUser);
  });
});
