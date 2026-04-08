/**
 * @file ErrorTools.test.ts
 * @module Backend/Tests/Tools
 * @description Tests unitarios expandidos para ErrorTools.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05, RNF-08
 *
 * @business
 * inputs: errores Zod, errores genéricos, AppErrors, inputs con reserved words
 * outputs: verificación de normalización a PublicErrorEnvelope con código y params correctos
 * rules: Zod → VALIDATION_ERROR con campos; reserved → RESERVED_VALUE; AppError lanzado → se preserva; interno desconocido → INTERNAL_ERROR sin params
 *
 * @technical
 * dependencies: vitest, zod, @app/sdk, ErrorTools
 * flow: construye errores de cada tipo; captura via ErrorTools.catch; verifica envelope resultante
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-ERRTOOLS-01 a TC-ERRTOOLS-05
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: los errores de Prisma se prueban en un archivo separado (ErrorTools.parsePrisma.test.ts) para mayor claridad
 */
import * as z from 'zod';
import { ZodError } from 'zod';
import { describe, expect, it } from 'vitest';
import { ERROR_CODES, ERR } from '@app/sdk';
import { ErrorTools } from '../../src/tools/ErrorTools';

// ─────────────────────────────────────────────────────────────
// TC-ERRTOOLS-01 — ZodError
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — ZodError', () => {
  const schema = z.object({
    email: z.email(),
    password: z.string().min(8),
  });

  it('TC-ERRTOOLS-01a: normaliza errores de validación Zod como envelopes públicos', () => {
    const parsed = schema.safeParse({ email: 'nope', password: '123' });
    expect(parsed.success).toBe(false);

    const envelope = ErrorTools.catch(parsed.error as ZodError, schema);

    expect(envelope.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(envelope.error.params).toEqual(['email', 'password']);
  });

  it('TC-ERRTOOLS-01b: solo reporta los campos que fallan (no todos del schema)', () => {
    const parsed = schema.safeParse({ email: 'valid@email.com', password: '123' });
    expect(parsed.success).toBe(false);

    const envelope = ErrorTools.catch(parsed.error as ZodError, schema);

    expect(envelope.error.params).toEqual(['password']);
  });

  it('TC-ERRTOOLS-01c: no incluye clave params en respuesta si no hay campos reportados', () => {
    const envelope = ErrorTools.catch(new Error('boom'));
    expect(envelope.error).not.toHaveProperty('params');
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ERRTOOLS-02 — Error interno genérico
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — Error genérico', () => {
  it('TC-ERRTOOLS-02: oculta detalles internos en errores desconocidos', () => {
    const envelope = ErrorTools.catch(new Error('boom'));

    expect(envelope).toEqual({
      error: { code: ERROR_CODES.INTERNAL_ERROR },
    });
  });

  it('oculta detalles de strings lanzados directamente', () => {
    const envelope = ErrorTools.catch('something unexpected');
    expect(envelope.error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ERRTOOLS-03 — Reserved value
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — reserved value', () => {
  const schema = z.object({ username: z.string() });

  it('TC-ERRTOOLS-03a: detecta valores reservados desde el input', () => {
    const envelope = ErrorTools.catch(new Error('irrelevant'), schema, {
      username: 'admin-master',
    });

    expect(envelope.error.code).toBe(ERROR_CODES.RESERVED_VALUE);
    expect(envelope.error.params).toEqual(['username']);
  });

  it('TC-ERRTOOLS-03b: detecta múltiples campos con valores reservados', () => {
    const multiSchema = z.object({ username: z.string(), alias: z.string() });
    const envelope = ErrorTools.catch(new Error('irrelevant'), multiSchema, {
      username: 'admin_user',
      alias: 'root_alias',
    });

    expect(envelope.error.code).toBe(ERROR_CODES.RESERVED_VALUE);
    expect(envelope.error.params).toContain('username');
    expect(envelope.error.params).toContain('alias');
  });

  it('TC-ERRTOOLS-03c: no reporta campos sin valores reservados', () => {
    const envelope = ErrorTools.catch(new Error('irrelevant'), schema, {
      username: 'victor_normal',
    });

    // Sin reserved → INTERNAL_ERROR
    expect(envelope.error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ERRTOOLS-04 — AppError lanzado directo
// ─────────────────────────────────────────────────────────────
describe('ErrorTools.catch — AppError directo', () => {
  it('TC-ERRTOOLS-04a: AppError UNAUTHORIZED se preserva sin modificación', () => {
    const appError = ERR.UNAUTHORIZED();
    const envelope = ErrorTools.catch(appError);

    expect(envelope.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it('TC-ERRTOOLS-04b: AppError VALIDATION se preserva con params', () => {
    const appError = ERR.VALIDATION(['email', 'username']);
    const envelope = ErrorTools.catch(appError);

    expect(envelope.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(envelope.error.params).toEqual(['email', 'username']);
  });

  it('TC-ERRTOOLS-04c: AppError FORBIDDEN no expone params (no está en SAFE_CODES)', () => {
    const appError = ERR.FORBIDDEN(['someInternalParam']);
    const envelope = ErrorTools.catch(appError);

    expect(envelope.error.code).toBe(ERROR_CODES.FORBIDDEN);
    expect(envelope.error).not.toHaveProperty('params');
  });

  it('TC-ERRTOOLS-04d: AppError INTERNAL no expone params', () => {
    const appError = ERR.INTERNAL();
    const envelope = ErrorTools.catch(appError);

    expect(envelope.error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
    expect(envelope.error).not.toHaveProperty('params');
  });

  it('TC-ERRTOOLS-04e: AppError NOT_FOUND expone params (está en SAFE_CODES)', () => {
    const appError = ERR.NOT_FOUND(['userId']);
    const envelope = ErrorTools.catch(appError);

    expect(envelope.error.code).toBe(ERROR_CODES.RESOURCE_NOT_FOUND);
    expect(envelope.error.params).toEqual(['userId']);
  });
});
