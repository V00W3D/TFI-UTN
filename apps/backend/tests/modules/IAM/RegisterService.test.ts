/**
 * @file RegisterService.test.ts
 * @module Backend/Tests/IAM
 * @description Tests unitarios para RegisterService.ts usando mocks de Prisma y argon2.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-01
 * rnf: RNF-02
 *
 * @business
 * inputs: datos de registro (name, email, password, etc.)
 * outputs: void (creación exitosa)
 * rules: hashear password antes de persistir; normalizar (trim/lowercase) email y username; crear perfil CUSTOMER/REGULAR por defecto
 *
 * @technical
 * dependencies: vitest, prisma (mocked), argon2 (mocked), RegisterService
 * flow: mockea argon2.hash; mockea prisma.user.create; ejecuta servicio; verifica normalización de datos y llamadas
 *
 * @estimation
 * complexity: Low
 * fpa: EI
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-REGISTER-01 a TC-REGISTER-02
 * ultima prueba exitosa: 2026-04-08 12:50:15
 *
 * @notes
 * decisions: se verifica que la persistencia incluya la jerarquía relacional necesaria para el perfil CUSTOMER
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as argon2 from 'argon2';

// ─────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────
vi.mock('argon2', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password_123'),
}));

vi.mock('../../../src/tools/db', () => ({
  prisma: {
    user: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from '../../../src/tools/db';
import { registerService } from '../../../src/modules/IAM/services/RegisterService';

const mockPrisma = prisma as unknown as { user: { create: ReturnType<typeof vi.fn> } };
const mockArgon2 = argon2 as unknown as { hash: ReturnType<typeof vi.fn> };

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────
describe('RegisterService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-REGISTER-01: registra un nuevo usuario con datos normalizados', async () => {
    await registerService({
      name: '  Victor  ',
      lname: 'Perez  ',
      sex: 'MALE',
      username: 'Victor_Q  ',
      email: '  VICTOR@example.com  ',
      password: 'password123',
      cpassword: 'password123',
    });

    expect(mockArgon2.hash).toHaveBeenCalledWith('password123');
    expect(mockPrisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        name: 'Victor',
        lname: 'Perez',
        username: 'victor_q',
        email: 'victor@example.com',
        password: 'hashed_password_123',
        role: 'CUSTOMER',
        customer: {
          create: { tier: 'REGULAR' },
        },
      }),
    }));
  });

  it('TC-REGISTER-02: falla si Prisma lanza una excepción de duplicado', async () => {
    mockPrisma.user.create.mockRejectedValue(new Error('P2002')); // Unique constraint

    await expect(registerService({
      name: 'Victor',
      lname: 'Perez',
      sex: 'MALE',
      username: 'victor',
      email: 'victor@example.com',
      password: 'password123',
      cpassword: 'password123',
    })).rejects.toThrow();
  });
});
