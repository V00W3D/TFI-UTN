/**
 * @file verifyUpdateService.test.ts
 * @module Backend/Tests/IAM
 * @description Tests unitarios para verifyUpdateService.ts usando mocks de Prisma y argon2.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-06
 * rnf: RNF-02
 *
 * @business
 * inputs: userId, tipo de cambio, token/PIN
 * outputs: datos de usuario actualizado
 * rules: validar token contra DB; verificar expiración; aplicar cambio según tipo (PASSWORD_CHANGE, EMAIL_CHANGE, etc.); limpiar tokens usados; retornar perfil AuthUser
 *
 * @technical
 * dependencies: vitest, prisma (mocked), argon2 (mocked), verifyUpdateService
 * flow: mockea findFirst para el token; mockea $transaction; mockea updates de usuario; ejecuta servicio; verifica lógica de negocio
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-VERIFY-01 a TC-VERIFY-04
 * ultima prueba exitosa: 2026-04-08 12:45:12
 *
 * @notes
 * decisions: se mockea la transacción de Prisma para asegurar aislamiento y verificación de llamadas a mutación
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as argon2 from 'argon2';
import { ERROR_CODES } from '@app/sdk';

// ─────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────
vi.mock('argon2', () => ({
  hash: vi.fn().mockResolvedValue('new_hashed_password'),
}));

vi.mock('../../../src/tools/db', () => ({
  prisma: {
    verificationToken: {
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
    },
    user: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(vi.mocked(prisma))),
  },
}));

import { prisma } from '../../../src/tools/db';
import { verifyUpdateService } from '../../../src/modules/IAM/services/verifyUpdateService';

const mockPrisma = prisma as any;
const mockArgon2 = argon2 as unknown as { hash: ReturnType<typeof vi.fn> };

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const mockValidToken = {
  id: 'token-1',
  userId: 'user-1',
  type: 'PASSWORD_CHANGE',
  token: '123456',
  expiresAt: new Date(Date.now() + 10000), // Válido por 10s
  payload: null,
};

const mockUpdatedUser = {
  id: 'user-1',
  username: 'victor',
  name: 'Victor',
  sname: null,
  lname: 'Test',
  sex: 'MALE',
  email: 'victor@example.com',
  emailVerified: true,
  phone: null,
  phoneVerified: true,
  role: 'CUSTOMER',
  customer: { tier: 'REGULAR' },
  staff: null,
  authority: null,
};

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────
describe('verifyUpdateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-VERIFY-01: procesa cambio de PASSWORD exitosamente', async () => {
    mockPrisma.verificationToken.findFirst.mockResolvedValue(mockValidToken);
    mockPrisma.user.findUnique.mockResolvedValue(mockUpdatedUser);

    const result = await verifyUpdateService('user-1', {
      type: 'PASSWORD_CHANGE',
      token: '123456',
      newPassword: 'new-password-123',
      cpassword: 'new-password-123',
    });

    expect(result.id).toBe('user-1');
    expect(mockArgon2.hash).toHaveBeenCalledWith('new-password-123');
    expect(mockPrisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'user-1' },
      data: expect.objectContaining({ password: 'new_hashed_password' }),
    }));
    expect(mockPrisma.verificationToken.deleteMany).toHaveBeenCalled();
  });

  it('TC-VERIFY-02: procesa cambio de EMAIL exitosamente con payload', async () => {
    mockPrisma.verificationToken.findFirst.mockResolvedValue({
      ...mockValidToken,
      type: 'EMAIL_CHANGE',
      payload: 'new-mail@example.com',
    });
    mockPrisma.user.findUnique.mockResolvedValue(mockUpdatedUser);

    await verifyUpdateService('user-1', {
      type: 'EMAIL_CHANGE',
      token: '123456',
    });

    expect(mockPrisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        email: 'new-mail@example.com',
        emailVerified: true,
      }),
    }));
  });

  it('TC-VERIFY-03: falla si el token no existe o ha expirado', async () => {
    mockPrisma.verificationToken.findFirst.mockResolvedValue(null);

    await expect(
      verifyUpdateService('user-1', {
        type: 'PASSWORD_CHANGE',
        token: 'wrong',
      })
    ).rejects.toMatchObject({ code: ERROR_CODES.UNAUTHORIZED });
    
    // Debería fallar también si expiró
    mockPrisma.verificationToken.findFirst.mockResolvedValue({
      ...mockValidToken,
      expiresAt: new Date(Date.now() - 1000), // Expirado hace 1s
    });

    await expect(
      verifyUpdateService('user-1', {
        type: 'PASSWORD_CHANGE',
        token: '123456',
      })
    ).rejects.toMatchObject({ code: ERROR_CODES.UNAUTHORIZED });
  });

  it('TC-VERIFY-04: falla si falta el campo obligatorio según el tipo', async () => {
    mockPrisma.verificationToken.findFirst.mockResolvedValue(mockValidToken);

    await expect(
      verifyUpdateService('user-1', {
        type: 'PASSWORD_CHANGE',
        token: '123456',
        // newPassword: omitido
      })
    ).rejects.toMatchObject({ code: ERROR_CODES.VALIDATION_ERROR });
  });
});
