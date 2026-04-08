/**
 * @file optionalUser.test.ts
 * @module Backend/Tests/Tools
 * @description Unit tests for readOptionalUserId — reads JWTs without rotating cookies.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: req.cookies with CupCake and/or Cake JWTs
 * outputs: extracted user ID or null
 * rules: returns null when no cookies or invalid tokens; prefers CupCake over Cake
 *
 * @technical
 * dependencies: vitest, optionalUser, jsonwebtoken
 * flow: sign real JWTs with test secrets -> create mock req -> assert extracted user id
 *
 * @estimation
 * complexity: Low
 * fpa: ILF
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-OPT-USER-01 to TC-OPT-USER-04
 * ultima prueba exitosa: 2026-04-08 15:00:00
 *
 * @notes
 * decisions: env is mocked so the JWT secrets match those used to sign test tokens.
 */
import { describe, expect, it, vi } from 'vitest';
import * as jwt from 'jsonwebtoken';
import type { Request } from 'express';

const SESSION_SECRET = 'test-session-secret';
const REFRESH_SECRET = 'test-refresh-secret';

vi.mock('../../src/env', () => ({
  SESSION_SECRET,
  REFRESH_SECRET,
  BUN_MODE: 'dev',
  BACKEND_PORT: '3001',
  DATABASE_URL: 'postgresql://test',
}));

import { readOptionalUserId } from '../../src/tools/optionalUser';

const makeReq = (cookies: Record<string, string>): Request =>
  ({ cookies } as unknown as Request);

describe('readOptionalUserId', () => {
  it('TC-OPT-USER-01: retorna null cuando no hay cookies', () => {
    expect(readOptionalUserId(makeReq({}))).toBeNull();
  });

  it('TC-OPT-USER-02: extrae id desde CupCake (access token)', () => {
    const token = jwt.sign({ id: 'u-access', role: 'CUSTOMER' }, SESSION_SECRET, { expiresIn: '1h' });
    const result = readOptionalUserId(makeReq({ CupCake: token }));
    expect(result).toBe('u-access');
  });

  it('TC-OPT-USER-03: extrae id desde Cake (refresh) cuando no hay CupCake', () => {
    const token = jwt.sign({ id: 'u-refresh', role: 'CUSTOMER' }, REFRESH_SECRET, { expiresIn: '7d' });
    const result = readOptionalUserId(makeReq({ Cake: token }));
    expect(result).toBe('u-refresh');
  });

  it('TC-OPT-USER-04: retorna null cuando el token está firmado con secreto erróneo', () => {
    const bad = jwt.sign({ id: 'evil' }, 'wrong-secret', { expiresIn: '1h' });
    expect(readOptionalUserId(makeReq({ CupCake: bad }))).toBeNull();
  });
});
