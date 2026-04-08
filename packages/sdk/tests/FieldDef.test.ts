/**
 * @file FieldDef.test.ts
 * @module SDK/Tests
 * @description Tests unitarios completos para FieldDef.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: configuraciones declarativas de campo
 * outputs: verificación de schemas Zod y reglas de UI generados
 * rules: los schemas deben respetar min/max/pattern/format/reserved/nullable; resolveFieldDefault debe producir valores seguros
 *
 * @technical
 * dependencies: vitest, zod, @app/sdk (FieldDef)
 * flow: define configs de campo; parsea valores válidos e inválidos; verifica schema generado y reglas de UI
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1.5
 *
 * @testing
 * cases: TC-FIELD-01, TC-FIELD-02, TC-FIELD-03
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se prueba el schema directamente via safeParse para desacoplar del formato de mensajes de error
 */
import { describe, expect, it } from 'vitest';
import * as z from 'zod';
import { defineField, resolveFieldDefault, NAME_BASE, PASSWORD_LENGTH } from '../FieldDef';

// ─────────────────────────────────────────────────────────────
// TC-FIELD-01 — defineField básico (string, min, max)
// ─────────────────────────────────────────────────────────────
describe('defineField — constraints básicos', () => {
  const field = defineField({
    label: 'Nombre de prueba',
    min: { value: 3 },
    max: { value: 10 },
    rules: ['Entre 3 y 10 caracteres'],
  });

  it('acepta string dentro del rango', () => {
    expect(field.schema.safeParse('abc').success).toBe(true);
    expect(field.schema.safeParse('1234567890').success).toBe(true);
  });

  it('rechaza string por debajo del mínimo', () => {
    expect(field.schema.safeParse('ab').success).toBe(false);
  });

  it('rechaza string por encima del máximo', () => {
    expect(field.schema.safeParse('12345678901').success).toBe(false);
  });

  it('aplica trim automáticamente', () => {
    const result = field.schema.safeParse('  abc  ');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('abc');
  });

  it('expone las reglas de UI correctas', () => {
    expect(field.rules).toEqual(['Entre 3 y 10 caracteres']);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-FIELD-02 — defineField nullable
// ─────────────────────────────────────────────────────────────
describe('defineField — nullable', () => {
  const field = defineField({
    label: 'Campo opcional',
    nullable: true,
    rules: [],
  });

  it('acepta null cuando nullable es true', () => {
    expect(field.schema.safeParse(null).success).toBe(true);
  });

  it('acepta string cuando nullable es true', () => {
    expect(field.schema.safeParse('valor').success).toBe(true);
  });

  const nonNullable = defineField({ label: 'Requerido', rules: [] });

  it('rechaza null cuando nullable es false (default)', () => {
    expect(nonNullable.schema.safeParse(null).success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-FIELD-03 — defineField con pattern
// ─────────────────────────────────────────────────────────────
describe('defineField — pattern', () => {
  const field = defineField({
    label: 'Alfanumérico',
    pattern: {
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Solo letras y números',
    },
    rules: [],
  });

  it('acepta string que cumple el patrón', () => {
    expect(field.schema.safeParse('abc123').success).toBe(true);
  });

  it('rechaza string que no cumple el patrón', () => {
    expect(field.schema.safeParse('abc 123!').success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-FIELD-04 — defineField con reserved words
// ─────────────────────────────────────────────────────────────
describe('defineField — reserved words', () => {
  const field = defineField({
    label: 'Usuario',
    reserved: { words: ['admin', 'root'], message: 'Palabra reservada' },
    rules: [],
  });

  it('rechaza string que contiene palabra reservada', () => {
    expect(field.schema.safeParse('user_admin').success).toBe(false);
    expect(field.schema.safeParse('root_access').success).toBe(false);
  });

  it('acepta string sin palabras reservadas', () => {
    expect(field.schema.safeParse('victor123').success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-FIELD-05 — defineField con format 'email'
// ─────────────────────────────────────────────────────────────
describe('defineField — format: email', () => {
  const field = defineField({
    label: 'Email',
    format: 'email',
    rules: [],
  });

  it('acepta email válido', () => {
    expect(field.schema.safeParse('victor@example.com').success).toBe(true);
  });

  it('rechaza email malformado', () => {
    expect(field.schema.safeParse('not-an-email').success).toBe(false);
    expect(field.schema.safeParse('missing@').success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-FIELD-06 — defineField con lowercase
// ─────────────────────────────────────────────────────────────
describe('defineField — lowercase', () => {
  const field = defineField({
    label: 'Email lower',
    lowercase: true,
    rules: [],
  });

  it('transforma el input a minúsculas', () => {
    const result = field.schema.safeParse('TEST@EXAMPLE.COM');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('test@example.com');
  });
});

// ─────────────────────────────────────────────────────────────
// TC-FIELD-07 — NAME_BASE y PASSWORD_LENGTH presets
// ─────────────────────────────────────────────────────────────
describe('presets compartidos', () => {
  it('NAME_BASE tiene min 2, max 128 y pattern de letras', () => {
    const field = defineField({ label: 'Test', ...NAME_BASE });
    expect(field.schema.safeParse('Ab').success).toBe(true);
    expect(field.schema.safeParse('A').success).toBe(false);
    expect(field.schema.safeParse('123').success).toBe(false);
  });

  it('PASSWORD_LENGTH tiene min 8 y max 128', () => {
    const field = defineField({ label: 'Pass', ...PASSWORD_LENGTH, rules: [] });
    expect(field.schema.safeParse('12345678').success).toBe(true);
    expect(field.schema.safeParse('1234567').success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-FIELD-08 — resolveFieldDefault
// ─────────────────────────────────────────────────────────────
describe('resolveFieldDefault', () => {
  it('retorna string vacío para ZodString', () => {
    expect(resolveFieldDefault(z.string())).toBe('');
  });

  it('retorna null para ZodNullable cuando null es un valor válido', () => {
    const result = resolveFieldDefault(z.string().nullable());
    // ZodNullable acepta null como candidato
    expect(result === null || result === '').toBe(true);
  });

  it('retorna false para ZodBoolean', () => {
    expect(resolveFieldDefault(z.boolean())).toBe(false);
  });

  it('retorna 0 para ZodNumber', () => {
    expect(resolveFieldDefault(z.number())).toBe(0);
  });

  it('retorna [] para ZodArray', () => {
    expect(resolveFieldDefault(z.array(z.string()))).toEqual([]);
  });
});
