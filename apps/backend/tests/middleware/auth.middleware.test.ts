/**
 * @file auth.middleware.test.ts
 * @module Backend/Tests/Middleware
 * @description Tests unitarios expandidos para auth.middleware.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-02, RF-10
 * rnf: RNF-02
 *
 * @business
 * inputs: cookies CupCake (access) y Cake (refresh) válidas, expiradas o ausentes
 * outputs: verificación de poblado de req.user, rotación de cookie CupCake, y rechazo con UNAUTHORIZED
 * rules: sin tokens → UNAUTHORIZED; CupCake válido → popula req.user directo; Cake válido solo → rota CupCake; token expirado/inválido → UNAUTHORIZED
 *
 * @technical
 * dependencies: vitest, jsonwebtoken, express, @app/sdk, env
 * flow: firma JWTs con secreto de test; construye req/res/next mocks; ejecuta authMiddleware; verifica efectos
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUTH-01 a TC-AUTH-07, TC-ROLE-01 a TC-ROLE-03
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: los tokens se firman directamente con los secretos del env de test para evitar mocks del módulo jwt
 */
import type { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { describe, expect, it, vi } from 'vitest';
import { ERROR_CODES } from '@app/sdk';
import { REFRESH_SECRET, SESSION_SECRET } from '../../src/env';
import { authMiddleware } from '../../src/middleware/auth.middleware';

vi.mock('../../src/env', () => ({
  SESSION_SECRET: 'test-session-secret',
  REFRESH_SECRET: 'test-refresh-secret',
  BUN_MODE: 'dev',
  BACKEND_PORT: '3001',
  DATABASE_URL: 'postgresql://test',
}));

// ─────────────────────────────────────────────────────────────
// Helpers de construcción de mocks
// ─────────────────────────────────────────────────────────────
type MockRequest = Partial<Request> & { 
  cookies: Record<string, string>; 
  user?: import('@app/contracts').AuthUser;
};
type MockResponse = Partial<Response> & { 
  cookie: ReturnType<typeof vi.fn>;
};

const createResponse = (): MockResponse => {
  const res = {
    cookie: vi.fn().mockReturnThis(),
  } as unknown as MockResponse;
  return res;
};

const createNext = () => vi.fn() as unknown as NextFunction & { mock: { calls: any[][] } };

const basePayload = {
  id: 'user-1',
  role: 'CUSTOMER',
  username: 'victor',
  name: 'Victor',
  lname: 'Test',
  email: 'victor@example.com',
  emailVerified: true,
  profile: { tier: 'VIP' },
};

// ─────────────────────────────────────────────────────────────
// TC-AUTH-01 — Sin tokens
// ─────────────────────────────────────────────────────────────
describe('authMiddleware', () => {
  it('TC-AUTH-01: rechaza requests sin access token ni refresh token', async () => {
    const req: MockRequest = { cookies: {} };
    const res = createResponse();
    const next = createNext();

    await authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    const firstArg = next.mock.calls[0]?.[0] as import('@app/sdk').PublicErrorEnvelope['error'];
    expect(firstArg?.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  // ─────────────────────────────────────────────────────────────
  // TC-AUTH-02 — CupCake válido
  // ─────────────────────────────────────────────────────────────
  it('TC-AUTH-02: acepta CupCake válido y puebla req.user', async () => {
    const access = jwt.sign(basePayload, SESSION_SECRET, { expiresIn: '1h' });
    const req: MockRequest = { cookies: { CupCake: access } };
    const res = createResponse();
    const next = createNext();

    await authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user?.id).toBe('user-1');
    expect(req.user?.profile.tier).toBe('VIP');
  });

  // ─────────────────────────────────────────────────────────────
  // TC-AUTH-03 — Cake válido rota nuevo CupCake
  // ─────────────────────────────────────────────────────────────
  it('TC-AUTH-03: rota un nuevo CupCake cuando solo hay Cake válido', async () => {
    const refresh = jwt.sign(
      { ...basePayload, id: 'user-2', username: 'refresh-user', profile: { tier: 'PREMIUM' } },
      REFRESH_SECRET,
      { expiresIn: '7d' },
    );
    const req: MockRequest = { cookies: { Cake: refresh } };
    const res = createResponse();
    const next = createNext();

    await authMiddleware(req as Request, res as Response, next);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie.mock.calls[0]?.[0]).toBe('CupCake');
    expect(req.user?.username).toBe('refresh-user');
    expect(req.user?.profile.tier).toBe('PREMIUM');
    expect(next).toHaveBeenCalledWith();
  });

  // ─────────────────────────────────────────────────────────────
  // TC-AUTH-04 — CupCake con firma inválida
  // ─────────────────────────────────────────────────────────────
  it('TC-AUTH-04: rechaza CupCake con firma inválida', async () => {
    const tampered = jwt.sign(basePayload, 'wrong-secret', { expiresIn: '1h' });
    const req: MockRequest = { cookies: { CupCake: tampered } };
    const res = createResponse();
    const next = createNext();

    await authMiddleware(req as Request, res as Response, next);

    const firstArg = next.mock.calls[0]?.[0] as import('@app/sdk').PublicErrorEnvelope['error'];
    expect(firstArg?.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  // ─────────────────────────────────────────────────────────────
  // TC-AUTH-05 — Cake con firma inválida
  // ─────────────────────────────────────────────────────────────
  it('TC-AUTH-05: rechaza Cake con firma inválida', async () => {
    const tampered = jwt.sign(basePayload, 'wrong-secret', { expiresIn: '7d' });
    const req: MockRequest = { cookies: { Cake: tampered } };
    const res = createResponse();
    const next = createNext();

    await authMiddleware(req as Request, res as Response, next);

    const firstArg = next.mock.calls[0]?.[0] as import('@app/sdk').PublicErrorEnvelope['error'];
    expect(firstArg?.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  // ─────────────────────────────────────────────────────────────
  // TC-AUTH-06 — CupCake expirado sin Cake → UNAUTHORIZED
  // ─────────────────────────────────────────────────────────────
  it('TC-AUTH-06: rechaza CupCake expirado cuando no hay Cake', async () => {
    const expired = jwt.sign(basePayload, SESSION_SECRET, { expiresIn: '0s' });
    await new Promise((r) => setTimeout(r, 10)); // Espera expiración

    const req: MockRequest = { cookies: { CupCake: expired } };
    const res = createResponse();
    const next = createNext();

    await authMiddleware(req as Request, res as Response, next);

    const firstArg = next.mock.calls[0]?.[0] as import('@app/sdk').PublicErrorEnvelope['error'];
    expect(firstArg?.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  // ─────────────────────────────────────────────────────────────
  // TC-AUTH-07 — CupCake con rol distinto popula req.user correctamente
  // ─────────────────────────────────────────────────────────────
  it('TC-AUTH-07: el rol del token se preserva en req.user sin validar permisos', async () => {
    const staffToken = jwt.sign(
      { ...basePayload, role: 'STAFF', profile: { post: 'COOK' } },
      SESSION_SECRET,
      { expiresIn: '1h' },
    );
    const req: MockRequest = { cookies: { CupCake: staffToken } };
    const res = createResponse();
    const next = createNext();

    await authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user?.role).toBe('STAFF');
    expect(req.user?.profile.post).toBe('COOK');
  });
});
