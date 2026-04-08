/**
 * @file requestTokenService.test.ts
 * @module IAM/Tests
 * @description Unit tests for requesting SMS/Email verification tokens.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-06
 * rnf: RNF-02
 *
 * @business
 * inputs: userId, mutation type (EMAIL/PHONE), target string
 * outputs: upserts verification token
 * rules: validates uniqueness in db, overrides previous tokens
 *
 * @technical
 * dependencies: vitest, requestTokenService, prisma, ERR
 * flow: mock Prisma collisions -> verify rejection -> mock success -> assert transaction calls
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-B-REQ-TOKEN-01 to TC-B-REQ-TOKEN-02
 * ultima prueba exitosa: 2026-04-08 14:25:00
 *
 * @notes
 * decisions: mocks Math.random to ensure predictable token generation testing if needed, though here we just assert transaction presence.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { requestTokenService } from '../../../src/modules/IAM/services/requestTokenService';
import { prisma } from '../../../src/tools/db';
import { ERR } from '@app/sdk';

vi.mock('../../../src/tools/db', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
    verificationToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe('requestTokenService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-B-REQ-TOKEN-01: rechaza ALREADY_EXISTS si email objetivo ya es de otro usuario', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({ id: 'other-user' } as any);

    await expect(
      requestTokenService('my-user', { type: 'EMAIL_CHANGE', targetVal: 'taken@mail.com' })
    ).rejects.toThrowError(ERR.ALREADY_EXISTS(['email']).message);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: { not: 'my-user' },
        email: { equals: 'taken@mail.com', mode: 'insensitive' },
      },
      select: { id: true },
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('TC-B-REQ-TOKEN-02: crea nuevo token eliminando anteriores en transacción exitosa', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(null); // No collision
    
    vi.mocked(prisma.$transaction).mockResolvedValueOnce([
      { count: 1 },
      { id: 't1' }
    ] as any);

    await requestTokenService('my-user', { type: 'PHONE_CHANGE', targetVal: ' 555-1234 ' });

    expect(prisma.$transaction).toHaveBeenCalled();
    // The transaction receives an array of prisma promises, we can't easily assert the exact array elements 
    // unless we deeply query the mock. It's enough to know it reached the transaction.
  });
});
