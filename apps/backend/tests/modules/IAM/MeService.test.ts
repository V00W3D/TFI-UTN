/**
 * @file MeService.test.ts
 * @module IAM/Tests
 * @description Unit tests for returning hydrated authenticated identity.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-05
 * rnf: RNF-02
 *
 * @business
 * inputs: Request object (potentially with .user property)
 * outputs: mapped MeContract payload
 * rules: requires req.user to be present (throws UNAUTHORIZED otherwise), limits fields extracted
 *
 * @technical
 * dependencies: vitest, MeService, ERR from SDK
 * flow: provide mock request -> assert successful mapping or UNAUTHORIZED rejection
 *
 * @estimation
 * complexity: Low
 * fpa: ILF
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-B-ME-01
 * ultima prueba exitosa: 2026-04-08 14:20:00
 *
 * @notes
 * decisions: focuses only on business logic decoupling from HTTP middleware transport.
 */
import { describe, expect, it } from 'vitest';
import { meService } from '../../../src/modules/IAM/services/MeService';
import { ERR } from '@app/sdk';
import type { Request } from 'express';

describe('MeService', () => {
  it('TC-B-ME-01: retorna los datos mapeados si el usuario está en request', async () => {
    const mockReq = {
      user: {
        id: 'user1',
        username: 'testu',
        name: 'Test',
        sname: '',
        lname: 'User',
        sex: 'M',
        email: 't@t.com',
        emailVerified: true,
        phone: null,
        phoneVerified: false,
        role: 'CUSTOMER',
        profile: {
          tier: 'GOLD'
        }
      }
    } as unknown as Request;

    const res = await meService(mockReq);

    expect(res).toEqual({
      id: 'user1',
      username: 'testu',
      name: 'Test',
      sname: '',
      lname: 'User',
      sex: 'M',
      email: 't@t.com',
      emailVerified: true,
      phone: null,
      phoneVerified: false,
      role: 'CUSTOMER',
      profile: {
        tier: 'GOLD'
      }
    });
  });

  it('TC-B-ME-02: rechaza con UNAUTHORIZED si no hay req.user', async () => {
    const mockReq = {} as Request;

    await expect(meService(mockReq)).rejects.toThrowError(ERR.UNAUTHORIZED().message);
  });
});
