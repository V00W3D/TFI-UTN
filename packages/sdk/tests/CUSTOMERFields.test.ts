/**
 * @file CUSTOMERFields.test.ts
 * @module SDK/Tests
 * @description Unit tests for CUSTOMERFields schemas and validation rules.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: strings, edge cases, valid/invalid formats
 * outputs: validation successes or failures with specific boundaries
 * rules: strict validation arrays and object limits according to QART standards
 *
 * @technical
 * dependencies: vitest, CUSTOMERFields
 * flow: provide strings at boundary lengths, test regex character sets, test nullable fields, verify enum definitions
 *
 * @estimation
 * complexity: Low
 * fpa: ILF
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-CUSTOMER-FIELDS-01 to TC-CUSTOMER-FIELDS-04
 * ultima prueba exitosa: 2026-04-08 13:30:00
 *
 * @notes
 * decisions: focuses only on the Zod schema property of the defined fields.
 */
import { describe, expect, it } from 'vitest';
import {
  plateNameField,
  descriptionField,
  tagNameField,
  plateTypeField,
  PLATE_TYPE_VALUES,
} from '../CUSTOMERFields';

describe('CUSTOMERFields', () => {
  it('TC-CUSTOMER-FIELDS-01: plateNameField rechaza strings demasiado cortos y caracteres inválidos', () => {
    expect(plateNameField.schema.safeParse('Hamburguesa Clasica').success).toBe(true);
    // Demasiado corto (min 2)
    const tooShort = plateNameField.schema.safeParse('A');
    expect(tooShort.success).toBe(false);
    expect((tooShort as any).error.issues.length).toBeGreaterThan(0);
    // Caracteres inválidos
    const invalidChars = plateNameField.schema.safeParse('Plato <Script>');
    expect(invalidChars.success).toBe(false);
    expect((invalidChars as any).error.issues[0].message).toContain('Solo se permiten letras');
  });

  it('TC-CUSTOMER-FIELDS-02: descriptionField acepta null y verifica longitud máxima', () => {
    // Válido
    expect(descriptionField.schema.safeParse('Una descripción válida.').success).toBe(true);
    // Acepta null
    expect(descriptionField.schema.safeParse(null).success).toBe(true);
    // Rechaza exceso de longitud
    const tooLong = 'A'.repeat(5001);
    const longParse = descriptionField.schema.safeParse(tooLong);
    expect(longParse.success).toBe(false);
    expect((longParse as any).error.issues.length).toBeGreaterThan(0);
  });

  it('TC-CUSTOMER-FIELDS-03: tagNameField valida patrón restrictivo', () => {
    // Válido
    expect(tagNameField.schema.safeParse('menu-2024_verano').success).toBe(true);
    // Rechaza mayúsculas y acentos? El pattern es /^[A-Za-zÀ-ÿ0-9\s\-_/]+$/
    // Acépta acentos
    expect(tagNameField.schema.safeParse('Menú del día').success).toBe(true);
    // Rechaza símbolos raros
    expect(tagNameField.schema.safeParse('Tag#1').success).toBe(false);
  });

  it('TC-CUSTOMER-FIELDS-04: los campos enum usan inferencia correcta', () => {
    // Válido
    expect(plateTypeField.schema.safeParse('MAIN').success).toBe(true);
    // Inválido
    expect(plateTypeField.schema.safeParse('INVALID').success).toBe(false);
    // Arrays exportados
    expect(PLATE_TYPE_VALUES).toContain('DESSERT');
  });
});
