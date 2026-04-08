/**
 * @file ErrorTools.parsePrisma.test.ts
 * @module Backend/Tests/Tools
 * @description Tests unitarios para la rama de parseo de errores Prisma en ErrorTools.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05, RNF-08
 *
 * @business
 * inputs: objetos PrismaClientKnownRequestError con distintos códigos de error
 * outputs: verificación del mapeo a PublicErrorEnvelope correcto según el código Prisma
 * rules: P2002 → ALREADY_EXISTS; P2025 → NOT_FOUND; P2000 → VALUE_TOO_LONG; P2003 → FOREIGN_KEY; código desconocido → INTERNAL_ERROR
 *
 * @technical
 * dependencies: vitest, @prisma/client (Prisma), @app/sdk, ErrorTools
 * flow: construye instancias de PrismaClientKnownRequestError con meta específica; captura via ErrorTools.catch con schema; verifica código y params del envelope
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1.5
 *
 * @testing
 * cases: TC-ERRTOOLS-PRISMA-01 a TC-ERRTOOLS-PRISMA-07
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: los errores de Prisma se construyen manually via Object.assign para evitar dependencias de infraestructura real
 */
import * as z from 'zod';
import { describe, expect, it } from 'vitest';
import { ERROR_CODES } from '@app/sdk';
import { Prisma } from '../../prisma/generated/client';
import { ErrorTools } from '../../src/tools/ErrorTools';

// ─────────────────────────────────────────────────────────────
// Helper para crear PrismaClientKnownRequestError mock
// ─────────────────────────────────────────────────────────────
const makePrismaError = (
  code: string,
  meta: Record<string, unknown> = {},
): Prisma.PrismaClientKnownRequestError => {
  const err = new Prisma.PrismaClientKnownRequestError('Prisma error', {
    code,
    clientVersion: 'test',
    meta,
  });
  return err;
};

const schema = z.object({
  email: z.string(),
  username: z.string(),
});

// ─────────────────────────────────────────────────────────────
// TC-PRISMA-01 — P2002 (unique constraint)
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — Prisma P2002 (unique constraint)', () => {
  it('TC-PRISMA-01: P2002 → RESOURCE_ALREADY_EXISTS con campo target', () => {
    const err = makePrismaError('P2002', { target: ['email'] });
    const envelope = ErrorTools.catch(err, schema);

    expect(envelope.error.code).toBe(ERROR_CODES.RESOURCE_ALREADY_EXISTS);
    expect(envelope.error.params).toEqual(['email']);
  });

  it('filtra targets que no son parte del schema', () => {
    const err = makePrismaError('P2002', { target: ['email', 'internalDbColumn'] });
    const envelope = ErrorTools.catch(err, schema);

    // 'internalDbColumn' no está en el schema, no debe aparecer
    expect(envelope.error.params).toEqual(['email']);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-PRISMA-02 — P2001 / P2025 (not found)
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — Prisma P2025 (not found)', () => {
  it('TC-PRISMA-02: P2025 → RESOURCE_NOT_FOUND con schemaFields como params', () => {
    const err = makePrismaError('P2025', {});
    const envelope = ErrorTools.catch(err, schema);

    expect(envelope.error.code).toBe(ERROR_CODES.RESOURCE_NOT_FOUND);
    // Los schemaFields del schema se usan como params cuando no hay targets
    expect(envelope.error.params).toBeDefined();
  });

  it('P2001 también mapea a NOT_FOUND', () => {
    const err = makePrismaError('P2001', {});
    const envelope = ErrorTools.catch(err, schema);
    expect(envelope.error.code).toBe(ERROR_CODES.RESOURCE_NOT_FOUND);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-PRISMA-03 — P2000 (value too long)
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — Prisma P2000 (value too long)', () => {
  it('TC-PRISMA-03: P2000 → VALUE_TOO_LONG', () => {
    const err = makePrismaError('P2000', { column_name: 'username' });
    const envelope = ErrorTools.catch(err, schema);

    expect(envelope.error.code).toBe(ERROR_CODES.VALUE_TOO_LONG);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-PRISMA-04 — P2003 (foreign key)
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — Prisma P2003 (foreign key)', () => {
  it('TC-PRISMA-04: P2003 → FOREIGN_KEY_CONSTRAINT', () => {
    const err = makePrismaError('P2003', { field_name: 'userId' });
    const envelope = ErrorTools.catch(err, schema);

    expect(envelope.error.code).toBe(ERROR_CODES.FOREIGN_KEY_CONSTRAINT);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-PRISMA-05 — P2011 / P2012 (null constraint)
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — Prisma P2011/P2012 (null constraint)', () => {
  it('TC-PRISMA-05: P2011 → NULL_CONSTRAINT', () => {
    const err = makePrismaError('P2011', { constraint: 'email' });
    const envelope = ErrorTools.catch(err, schema);
    expect(envelope.error.code).toBe(ERROR_CODES.NULL_CONSTRAINT);
  });

  it('P2012 también → NULL_CONSTRAINT', () => {
    const err = makePrismaError('P2012', {});
    const envelope = ErrorTools.catch(err, schema);
    expect(envelope.error.code).toBe(ERROR_CODES.NULL_CONSTRAINT);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-PRISMA-06 — P2020 (value out of range)
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — Prisma P2020 (value out of range)', () => {
  it('TC-PRISMA-06: P2020 → VALUE_OUT_OF_RANGE', () => {
    const err = makePrismaError('P2020', {});
    const envelope = ErrorTools.catch(err, schema);
    expect(envelope.error.code).toBe(ERROR_CODES.VALUE_OUT_OF_RANGE);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-PRISMA-07 — Código Prisma desconocido
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — Prisma código desconocido', () => {
  it('TC-PRISMA-07: código Prisma no mapeado → INTERNAL_ERROR', () => {
    const err = makePrismaError('P9999', {});
    const envelope = ErrorTools.catch(err, schema);
    expect(envelope.error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
  });
});
