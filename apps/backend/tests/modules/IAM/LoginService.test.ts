/**
 * @file LoginService.test.ts
 * @module Backend/Tests/IAM
 * @description Tests unitarios para loginService.ts usando mocks de argon2 y Prisma.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-02
 * rnf: RNF-02
 *
 * @business
 * inputs: identidad (username/email/phone) y password
 * outputs: payload AuthUser en caso de éxito; error 401 en caso de falla
 * rules: si el usuario no existe, simular verificación de hash (anti-timing); verificar hash real si existe; lanzar UNAUTHORIZED si falla cualquiera
 *
 * @technical
 * dependencies: vitest, argon2 (mocked), prisma (mocked), loginService
 * flow: mockea argon2.verify; mockea prisma methods; ejecuta loginService; verifica llamadas y resultados
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-LOGIN-SERVICE-01 a TC-LOGIN-SERVICE-04
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se mockea el módulo db completo para aislamiento total de la base de datos
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as argon2 from 'argon2';
import { ERROR_CODES } from '@app/sdk';

// ─────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────
vi.mock('argon2', () => ({
  verify: vi.fn(),
}));

vi.mock('../../../src/tools/db', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '../../../src/tools/db';
import { loginService } from '../../../src/modules/IAM/services/LoginService';

const mockPrisma = prisma as unknown as {
  user: {
    findFirst: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
};

const mockArgon2 = argon2 as unknown as {
  verify: ReturnType<typeof vi.fn>;
};

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const mockStoredUser = {
  id: 'user-123',
  password: 'hashed_password',
};

const mockFullUser = {
  id: 'user-123',
  username: 'victor_q',
  name: 'Victor',
  sname: null,
  lname: 'Perez',
  sex: 'MALE',
  email: 'victor@example.com',
  emailVerified: true,
  phone: null,
  phoneVerified: false,
  role: 'CUSTOMER',
  customer: { tier: 'VIP' },
  staff: null,
  authority: null,
};

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────
describe('LoginService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-LOGIN-SERVICE-01: login exitoso con credenciales correctas', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockStoredUser);
    mockArgon2.verify.mockResolvedValue(true);
    mockPrisma.user.findUnique.mockResolvedValue(mockFullUser);

    const result = await loginService({
      identity: 'victor@example.com',
      password: 'password123',
    });

    expect(result.id).toBe('user-123');
    expect(result.username).toBe('victor_q');
    expect(result.role).toBe('CUSTOMER');
    expect(mockArgon2.verify).toHaveBeenCalledWith('hashed_password', 'password123');
  });

  it('TC-LOGIN-SERVICE-02: falla si el usuario no existe (lanza UNAUTHORIZED)', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockArgon2.verify.mockResolvedValue(false); // No debería importar, pero se llama igual por seguridad

    await expect(
      loginService({
        identity: 'nonexistent',
        password: 'any',
      }),
    ).rejects.toMatchObject({ code: ERROR_CODES.UNAUTHORIZED });
    
    // Debe haber intentado verificar contra el FAKE_HASH
    expect(mockArgon2.verify).toHaveBeenCalled();
  });

  it('TC-LOGIN-SERVICE-03: falla si la contraseña es incorrecta (lanza UNAUTHORIZED)', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockStoredUser);
    mockArgon2.verify.mockResolvedValue(false);

    await expect(
      loginService({
        identity: 'victor@example.com',
        password: 'wrong_password',
      }),
    ).rejects.toMatchObject({ code: ERROR_CODES.UNAUTHORIZED });
  });

  it('TC-LOGIN-SERVICE-04: falla si el usuario desaparece entre consultas (lanza NOT_FOUND)', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(mockStoredUser);
    mockArgon2.verify.mockResolvedValue(true);
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      loginService({
        identity: 'victor@example.com',
        password: 'password123',
      }),
    ).rejects.toMatchObject({ code: ERROR_CODES.RESOURCE_NOT_FOUND });
  });
});
