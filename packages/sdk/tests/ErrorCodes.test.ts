/**
 * @file ErrorCodes.test.ts
 * @module SDK/Tests
 * @description Tests unitarios completos para ErrorCodes.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-10
 * rnf: RNF-08
 *
 * @business
 * inputs: factories ERR.*, AppError, helpers de envelope
 * outputs: verificación de códigos, status HTTP y shapes de error público
 * rules: cada factory debe producir el código y status exactos; los helpers deben discriminar correctamente
 *
 * @technical
 * dependencies: vitest, @app/sdk (ErrorCodes)
 * flow: importa factories y helpers; ejercita cada caso; aserta shape y comportamiento
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-ERR-01, TC-ERR-02, TC-ERR-03, TC-ERR-04, TC-ERR-05
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se prueban todos los factories para garantizar exhaustividad del mapa de errores
 */
import { describe, expect, it } from 'vitest';
import {
  AppError,
  ERROR_CODES,
  ERR,
  ErrorCodeEnum,
  isErrorEnvelope,
  httpStatusFrom,
  publicErrorSchema,
} from '../ErrorCodes';

// ─────────────────────────────────────────────────────────────
// TC-ERR-01 — AppError factory
// ─────────────────────────────────────────────────────────────
describe('AppError.create', () => {
  it('produce una instancia de Error con las propiedades correctas', () => {
    const err = AppError.create(ERROR_CODES.UNAUTHORIZED, 401, ['field1']);

    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AppError');
    expect(err.code).toBe(ERROR_CODES.UNAUTHORIZED);
    expect(err.status).toBe(401);
    expect(err.params).toEqual(['field1']);
  });

  it('produce toEnvelope con params cuando existen', () => {
    const err = AppError.create(ERROR_CODES.VALIDATION_ERROR, 400, ['email', 'password']);
    const envelope = err.toEnvelope();

    expect(envelope.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(envelope.error.params).toEqual(['email', 'password']);
  });

  it('produce toEnvelope sin la clave params cuando no hay params', () => {
    const err = AppError.create(ERROR_CODES.INTERNAL_ERROR, 500);
    const envelope = err.toEnvelope();

    expect(envelope.error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
    expect(envelope.error).not.toHaveProperty('params');
  });

  it('params por defecto es un array vacío si no se proveen', () => {
    const err = AppError.create(ERROR_CODES.FORBIDDEN, 403);
    expect(err.params).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ERR-02 — AppError.is discriminator
// ─────────────────────────────────────────────────────────────
describe('AppError.is', () => {
  it('devuelve true para instancias creadas con AppError.create', () => {
    const err = AppError.create(ERROR_CODES.FORBIDDEN, 403);
    expect(AppError.is(err)).toBe(true);
  });

  it('devuelve false para Error genérico', () => {
    expect(AppError.is(new Error('boom'))).toBe(false);
  });

  it('devuelve false para null y valores primitivos', () => {
    expect(AppError.is(null)).toBe(false);
    expect(AppError.is(undefined)).toBe(false);
    expect(AppError.is('string')).toBe(false);
    expect(AppError.is(42)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ERR-03 — ERR.* factories (código + status HTTP)
// ─────────────────────────────────────────────────────────────
describe('ERR factories', () => {
  const cases: [keyof typeof ERR, string, number][] = [
    ['VALIDATION', ERROR_CODES.VALIDATION_ERROR, 400],
    ['ALREADY_EXISTS', ERROR_CODES.RESOURCE_ALREADY_EXISTS, 409],
    ['NOT_FOUND', ERROR_CODES.RESOURCE_NOT_FOUND, 404],
    ['FOREIGN_KEY', ERROR_CODES.FOREIGN_KEY_CONSTRAINT, 400],
    ['RELATION', ERROR_CODES.RELATION_VIOLATION, 400],
    ['VALUE_TOO_LONG', ERROR_CODES.VALUE_TOO_LONG, 400],
    ['VALUE_INVALID', ERROR_CODES.VALUE_INVALID, 400],
    ['VALUE_OUT_OF_RANGE', ERROR_CODES.VALUE_OUT_OF_RANGE, 400],
    ['NULL', ERROR_CODES.NULL_CONSTRAINT, 400],
    ['RESERVED', ERROR_CODES.RESERVED_VALUE, 400],
    ['INVALID_CREDENTIALS', ERROR_CODES.INVALID_CREDENTIALS, 401],
    ['UNAUTHORIZED', ERROR_CODES.UNAUTHORIZED, 401],
    ['FORBIDDEN', ERROR_CODES.FORBIDDEN, 403],
    ['INTERNAL', ERROR_CODES.INTERNAL_ERROR, 500],
  ];

  it.each(cases)('ERR.%s produce código %s y status %d', (factory, code, status) => {
    const err = ERR[factory]();
    expect(err.code).toBe(code);
    expect(err.status).toBe(status);
    expect(AppError.is(err)).toBe(true);
  });

  it('ERR.VALIDATION acepta array de campos como params', () => {
    const err = ERR.VALIDATION(['email', 'username']);
    expect(err.params).toEqual(['email', 'username']);
  });

  it('ERR.NOT_FOUND sin params produce params vacío', () => {
    const err = ERR.NOT_FOUND();
    expect(err.params).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ERR-04 — isErrorEnvelope
// ─────────────────────────────────────────────────────────────
describe('isErrorEnvelope', () => {
  it('acepta envelope válido con code string', () => {
    expect(isErrorEnvelope({ error: { code: 'UNAUTHORIZED' } })).toBe(true);
  });

  it('acepta envelope con params opcional', () => {
    expect(isErrorEnvelope({ error: { code: 'VALIDATION_ERROR', params: ['email'] } })).toBe(true);
  });

  it('rechaza objeto sin propiedad error', () => {
    expect(isErrorEnvelope({ data: {} })).toBe(false);
  });

  it('rechaza cuando error.code no es string', () => {
    expect(isErrorEnvelope({ error: { code: 42 } })).toBe(false);
  });

  it('rechaza null y primitivos', () => {
    expect(isErrorEnvelope(null)).toBe(false);
    expect(isErrorEnvelope('string')).toBe(false);
    expect(isErrorEnvelope(undefined)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ERR-05 — httpStatusFrom
// ─────────────────────────────────────────────────────────────
describe('httpStatusFrom', () => {
  it('extrae el status de un AppError', () => {
    expect(httpStatusFrom(ERR.FORBIDDEN())).toBe(403);
    expect(httpStatusFrom(ERR.NOT_FOUND())).toBe(404);
    expect(httpStatusFrom(ERR.INTERNAL())).toBe(500);
  });

  it('extrae el status de un objeto genérico con propiedad status numérica', () => {
    expect(httpStatusFrom({ status: 422 })).toBe(422);
  });

  it('cae a 400 si el status no es número', () => {
    expect(httpStatusFrom({ status: 'bad' })).toBe(400);
  });

  it('cae a 400 para Error genérico sin status', () => {
    expect(httpStatusFrom(new Error('boom'))).toBe(400);
  });

  it('cae a 400 para null', () => {
    expect(httpStatusFrom(null)).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ERR-06 — ErrorCodeEnum y publicErrorSchema
// ─────────────────────────────────────────────────────────────
describe('ErrorCodeEnum y publicErrorSchema', () => {
  it('ErrorCodeEnum acepta todos los códigos definidos en ERROR_CODES', () => {
    for (const code of Object.values(ERROR_CODES)) {
      expect(ErrorCodeEnum.safeParse(code).success).toBe(true);
    }
  });

  it('ErrorCodeEnum rechaza códigos no registrados', () => {
    expect(ErrorCodeEnum.safeParse('FAKE_CODE').success).toBe(false);
  });

  it('publicErrorSchema parsea envelope válido', () => {
    const result = publicErrorSchema.safeParse({
      error: { code: 'UNAUTHORIZED' },
    });
    expect(result.success).toBe(true);
  });

  it('publicErrorSchema parsea envelope con params', () => {
    const result = publicErrorSchema.safeParse({
      error: { code: 'VALIDATION_ERROR', params: ['email'] },
    });
    expect(result.success).toBe(true);
  });

  it('publicErrorSchema rechaza envelope con code inválido', () => {
    const result = publicErrorSchema.safeParse({
      error: { code: 'NOT_A_REAL_CODE' },
    });
    expect(result.success).toBe(false);
  });
});
