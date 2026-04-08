/**
 * @file RegisterHandler.test.ts
 * @module IAM/Tests
 * @description Unit tests for RegisterHandler.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-01
 * rnf: RNF-05
 *
 * @business
 * inputs: registration data (name, email, password)
 * outputs: none (async completion)
 * rules: delegates account creation to RegisterService
 *
 * @technical
 * dependencies: vitest, RegisterHandler, RegisterService
 * flow: mock service -> call handler -> assert delegation
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-H-REGISTER-01
 * ultima prueba exitosa: 2026-04-08 14:05:00
 *
 * @notes
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { RegisterHandler } from '../../../src/modules/IAM/handlers/RegisterHandler';
import { registerService } from '../../../src/modules/IAM/services/RegisterService';

vi.mock('../../../src/tools/api', () => ({
  api: {
    handler: (_id: string) => (fn: any) => fn,
  },
}));

vi.mock('../../../src/modules/IAM/services/RegisterService', () => ({
  registerService: vi.fn(),
}));

describe('RegisterHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-H-REGISTER-01: delega en registerService con el input', async () => {
    const input = { name: 'New User', email: 'new@test.com', password: 'Password123!' };

    vi.mocked(registerService).mockResolvedValueOnce(undefined);

    await (RegisterHandler as any)(input);

    expect(registerService).toHaveBeenCalledWith(input);
  });
});
