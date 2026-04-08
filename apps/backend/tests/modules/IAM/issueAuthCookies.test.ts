/**
 * @file issueAuthCookies.test.ts
 * @module Backend/Tests/IAM
 * @description Tests unitarios para issueAuthCookies.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-02, RF-03
 * rnf: RNF-02
 *
 * @business
 * inputs: objeto Response de Express, datos de usuario autenticado
 * outputs: verificación de que se emiten cookies CupCake y Cake con los atributos de seguridad correctos
 * rules: CupCake firmado con SESSION_SECRET (1h); Cake firmado con REFRESH_SECRET (7d); ambas httpOnly
 *
 * @technical
 * dependencies: vitest, jsonwebtoken, express, env, issueAuthCookies
 * flow: construye user mock; invoca issueAuthCookies; inspecciona llamadas a res.cookie; verifica payload decodificado
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-COOKIES-01 a TC-COOKIES-04
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se decodifica el JWT resultante para verificar que el payload incluye todos los campos del usuario
 */
import * as jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { SESSION_SECRET, REFRESH_SECRET } from '../../../src/env';
import { issueAuthCookies } from '../../../src/modules/IAM/services/issueAuthCookies';

vi.mock('../../../src/env', () => ({
  SESSION_SECRET: 'test-session-secret',
  REFRESH_SECRET: 'test-refresh-secret',
  BUN_MODE: 'dev',
}));

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const mockUser = {
  id: 'user-abc',
  username: 'victor_q',
  name: 'Victor',
  sname: null,
  lname: 'Perez',
  sex: 'MALE' as const,
  email: 'victor@example.com',
  emailVerified: true,
  phone: null,
  phoneVerified: false,
  role: 'CUSTOMER' as const,
  profile: { tier: 'VIP' as const },
};

const createMockResponse = () => {
  const cookieFn = vi.fn();
  return { cookie: cookieFn } as unknown as Response;
};

// ─────────────────────────────────────────────────────────────
// TC-COOKIES-01 a 04
// ─────────────────────────────────────────────────────────────
describe('issueAuthCookies', () => {
  it('TC-COOKIES-01: emite exactamente 2 cookies (CupCake y Cake)', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    expect(res.cookie).toHaveBeenCalledTimes(2);
  });

  it('TC-COOKIES-02: la primera cookie es CupCake', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    const firstCall = (res.cookie as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(firstCall?.[0]).toBe('CupCake');
  });

  it('TC-COOKIES-03: la segunda cookie es Cake', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    const secondCall = (res.cookie as ReturnType<typeof vi.fn>).mock.calls[1];
    expect(secondCall?.[0]).toBe('Cake');
  });

  it('TC-COOKIES-04: CupCake tiene httpOnly: true', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    const firstCall = (res.cookie as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(firstCall?.[2]?.httpOnly).toBe(true);
  });

  it('Cake tiene httpOnly: true', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    const secondCall = (res.cookie as ReturnType<typeof vi.fn>).mock.calls[1];
    expect(secondCall?.[2]?.httpOnly).toBe(true);
  });

  it('el payload del CupCake contiene el id del usuario', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    const cupcakeToken = (res.cookie as ReturnType<typeof vi.fn>).mock.calls[0]?.[1] as string;
    const decoded = jwt.verify(cupcakeToken, SESSION_SECRET) as Record<string, unknown>;

    expect(decoded.id).toBe('user-abc');
  });

  it('el payload del CupCake contiene role y profile', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    const cupcakeToken = (res.cookie as ReturnType<typeof vi.fn>).mock.calls[0]?.[1] as string;
    const decoded = jwt.verify(cupcakeToken, SESSION_SECRET) as Record<string, unknown>;

    expect(decoded.role).toBe('CUSTOMER');
    expect((decoded.profile as Record<string, unknown>).tier).toBe('VIP');
  });

  it('el Cake usa REFRESH_SECRET (no SESSION_SECRET)', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    const cakeToken = (res.cookie as ReturnType<typeof vi.fn>).mock.calls[1]?.[1] as string;

    // Debe verificar con REFRESH_SECRET
    expect(() => jwt.verify(cakeToken, REFRESH_SECRET)).not.toThrow();
    // No debe verificar con SESSION_SECRET
    expect(() => jwt.verify(cakeToken, SESSION_SECRET)).toThrow();
  });

  it('CupCake tiene maxAge de 1 hora (3600000 ms)', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    const firstCall = (res.cookie as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(firstCall?.[2]?.maxAge).toBe(3600000);
  });

  it('Cake tiene maxAge de 7 días (604800000 ms)', () => {
    const res = createMockResponse();
    issueAuthCookies(res, mockUser);

    const secondCall = (res.cookie as ReturnType<typeof vi.fn>).mock.calls[1];
    expect(secondCall?.[2]?.maxAge).toBe(604800000);
  });
});
