/**
 * @file UpdateMeService.test.ts
 * @module IAM/Tests
 * @description Unit tests for updating the authenticated user's profile.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-05
 * rnf: RNF-05
 *
 * @business
 * inputs: partial update payload and userId
 * outputs: updated, mapped AuthUser payload
 * rules: filter undefined keys, pass non-undefined fields to Prisma update
 *
 * @technical
 * dependencies: vitest, updateMeService, Prisma, buildAuthUser
 * flow: provide partial input -> verify Prisma update payload is cleaned -> assert buildAuthUser is called
 *
 * @estimation
 * complexity: Medium
 * fpa: EI
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-B-UPDATE-ME-01
 * ultima prueba exitosa: 2026-04-08 14:30:00
 *
 * @notes
 * decisions: mocks `buildAuthUser` because we only care about mapping and Prisma argument transformation in this service.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { updateMeService } from '../../../src/modules/IAM/services/UpdateMeService';
import { prisma } from '../../../src/tools/db';
import { buildAuthUser } from '../../../src/modules/IAM/services/buildAuthUser';

vi.mock('../../../src/tools/db', () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

vi.mock('../../../src/modules/IAM/services/buildAuthUser', () => ({
  buildAuthUser: vi.fn((user) => ({ ...user, mapped: true })),
}));

describe('updateMeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-B-UPDATE-ME-01: ignora undefineds y pasa el resto a Prisma validando armado posterior', async () => {
    const dbResponse = { id: 'usr-1', email: 'a@a.com', role: 'CUSTOMER' };
    
    vi.mocked(prisma.user.update).mockResolvedValueOnce(dbResponse as any);

    const inputData = {
      name: 'Nuevo Nombre',
      sname: undefined,
      sex: 'F'
    } as any;

    const res = await updateMeService('usr-1', inputData);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'usr-1' },
      data: {
        name: 'Nuevo Nombre',
        sex: 'F'
      },
      include: expect.any(Object),
    });

    expect(buildAuthUser).toHaveBeenCalledWith(dbResponse);
    expect(res).toHaveProperty('mapped', true);
  });
});
