/**
 * @file role.middleware.test.ts
 * @module Backend/Tests/Middleware
 * @description Tests unitarios para role.middleware.ts (RBAC).
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-07, RF-08, RF-09, RF-10
 * rnf: RNF-02
 *
 * @business
 * inputs: req.user con role, lista de roles requeridos
 * outputs: verificación de acceso permitido o denegado con FORBIDDEN
 * rules: sin req.user → FORBIDDEN; rol no incluido → FORBIDDEN; rol exactamente incluido → next(); múltiples roles aceptados
 *
 * @technical
 * dependencies: vitest, express, @app/sdk
 * flow: configura req.user con distintos roles; invoca roleMiddleware(roles); verifica si next fue llamado con o sin error
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-ROLE-01 a TC-ROLE-05
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: roleMiddleware es stateless y puro; todos los casos se prueban sin mocks de módulos externos
 */
import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { ERROR_CODES } from '@app/sdk';
import { roleMiddleware } from '../../src/middleware/role.middleware';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const createNext = () => vi.fn() as unknown as NextFunction & ReturnType<typeof vi.fn>;
const createRes = () => ({}) as Response;

type MockRequest = Partial<Request> & { user?: import('@app/contracts').AuthUser };

const buildUser = (role: string) =>
  ({
    id: 'user-1',
    role,
    username: 'test',
    name: 'Test',
    sname: undefined,
    lname: 'User',
    sex: 'OTHER',
    email: 'test@test.com',
    emailVerified: true,
    phone: undefined,
    phoneVerified: false,
    profile: {},
  }) as unknown as import('@app/contracts').AuthUser;

// ───────────────────────────────────────────────────────────
// TC-ROLE-01 a TC-ROLE-05
// ───────────────────────────────────────────────────────────
describe('roleMiddleware', () => {
  it('TC-ROLE-01: sin req.user → llama next(FORBIDDEN)', () => {
    const req = {} as Request;
    const next = createNext();

    roleMiddleware(['CUSTOMER'])(req, createRes(), next);

    const firstArg = next.mock.calls[0]?.[0];
    expect(firstArg?.code).toBe(ERROR_CODES.FORBIDDEN);
  });

  it('TC-ROLE-02: rol no incluido en la lista → llama next(FORBIDDEN)', () => {
    const req = { user: buildUser('CUSTOMER') } as unknown as Request;
    const next = createNext();

    roleMiddleware(['AUTHORITY'])(req, createRes(), next);

    const firstArg = next.mock.calls[0]?.[0];
    expect(firstArg?.code).toBe(ERROR_CODES.FORBIDDEN);
  });

  it('TC-ROLE-03: rol exactamente incluido → llama next() sin argumentos', () => {
    const req = { user: buildUser('CUSTOMER') } as unknown as Request;
    const next = createNext();

    roleMiddleware(['CUSTOMER'])(req, createRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledTimes(1);
    const firstArg = next.mock.calls[0]?.[0];
    expect(firstArg).toBeUndefined();
  });

  it('TC-ROLE-04: múltiples roles permitidos — acepta cualquiera de ellos', () => {
    const customer = { user: buildUser('CUSTOMER') } as unknown as Request;
    const staff = { user: buildUser('STAFF') } as unknown as Request;
    const nextCustomer = createNext();
    const nextStaff = createNext();

    roleMiddleware(['CUSTOMER', 'STAFF'])(customer, createRes(), nextCustomer);
    roleMiddleware(['CUSTOMER', 'STAFF'])(staff, createRes(), nextStaff);

    expect(nextCustomer).toHaveBeenCalledWith();
    expect(nextStaff).toHaveBeenCalledWith();
  });

  it('TC-ROLE-05: AUTHORITY no pasa un middleware de solo CUSTOMER', () => {
    const req = { user: buildUser('AUTHORITY') } as unknown as Request;
    const next = createNext();

    roleMiddleware(['CUSTOMER'])(req, createRes(), next);

    const firstArg = next.mock.calls[0]?.[0];
    expect(firstArg?.code).toBe(ERROR_CODES.FORBIDDEN);
  });
});
