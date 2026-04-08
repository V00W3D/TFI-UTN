/**
 * @file enumLabels.test.ts
 * @module Frontend/Tests/Tools
 * @description Tests unitarios expandidos para enumLabels.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: valores de enum como strings, null o undefined
 * outputs: verificación de traducción al español, title case fallback y fallback de vacío
 * rules: valores registrados → traducción exacta; valores desconocidos → title case; null/undefined → 'No especificado'
 *
 * @technical
 * dependencies: vitest, enumLabels
 * flow: ejecuta formatEnumLabel con distintos inputs; verifica output string esperado
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-ENUM-01 a TC-ENUM-04
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se cubren todos los grupos del mapa (roles, tiers, categorías, marcadores nutricionales) para detectar omisiones
 */
import { describe, expect, it } from 'vitest';
import { formatEnumLabel } from '../../src/tools/enumLabels';

// ─────────────────────────────────────────────────────────────
// TC-ENUM-01 — Valores registrados en el mapa
// ─────────────────────────────────────────────────────────────
describe('formatEnumLabel — valores registrados', () => {
  const registeredCases: [string, string][] = [
    // Roles
    ['CUSTOMER', 'Cliente'],
    ['STAFF', 'Personal'],
    ['AUTHORITY', 'Autoridad'],
    // Tiers
    ['REGULAR', 'Regular'],
    ['VIP', 'VIP'],
    ['PREMIUM', 'Premium'],
    // Sexo
    ['MALE', 'Masculino'],
    ['FEMALE', 'Femenino'],
    ['OTHER', 'Otro'],
    // Tipo de plato
    ['STARTER', 'Entrada'],
    ['MAIN', 'Principal'],
    ['DESSERT', 'Postre'],
    ['SIDE', 'Acompanamiento'],
    ['DRINK', 'Bebida'],
    // Dificultad
    ['EASY', 'Facil'],
    ['MEDIUM', 'Media'],
    ['HARD', 'Dificil'],
    // Tamaño
    ['SMALL', 'Chico'],
    ['LARGE', 'Grande'],
    ['XL', 'Extra grande'],
    // Categorías de ingrediente
    ['PROTEIN_ANIMAL', 'Proteina animal'],
    ['GRAIN', 'Cereal'],
    ['DAIRY', 'Lacteo'],
    // Métodos de preparación
    ['GRILLED', 'A la plancha'],
    ['FRIED', 'Frito'],
    ['BAKED', 'Horneado'],
    ['BOILED', 'Hervido'],
    ['STEAMED', 'Al vapor'],
    // Alérgenos
    ['GLUTEN', 'Gluten'],
    ['PEANUT', 'Mani'],
    ['SESAME', 'Sesamo'],
    // Tags dietéticos
    ['GLUTEN_FREE', 'Sin gluten'],
    ['VEGAN', 'Vegano'],
    ['VEGETARIAN', 'Vegetariano'],
    // Tags nutricionales
    ['HIGH_PROTEIN', 'Alto en proteina'],
    ['LOW_SODIUM', 'Bajo en sodio'],
    ['HIGH_FIBER', 'Alto en fibra'],
    // Tipos de ajuste
    ['ADDITION', 'Agregado'],
    ['REMOVAL', 'Quita'],
    ['SUBSTITUTION', 'Sustitucion'],
  ];

  it.each(registeredCases)('traduce %s → %s', (input, expected) => {
    expect(formatEnumLabel(input)).toBe(expected);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ENUM-02 — Fallback a title case para valores desconocidos
// ─────────────────────────────────────────────────────────────
describe('formatEnumLabel — title case fallback', () => {
  it('transforma CUSTOM_VALUE a "Custom Value"', () => {
    expect(formatEnumLabel('CUSTOM_VALUE')).toBe('Custom Value');
  });

  it('transforma UNKNOWN_DIET_TAG a "Unknown Diet Tag"', () => {
    expect(formatEnumLabel('UNKNOWN_DIET_TAG')).toBe('Unknown Diet Tag');
  });

  it('transforma SINGLE a "Single" (sin guiones bajos)', () => {
    expect(formatEnumLabel('SINGLE')).toBe('Single');
  });

  it('transforma un valor ya en minúsculas a title case', () => {
    expect(formatEnumLabel('hello_world')).toBe('Hello World');
  });
});

// ─────────────────────────────────────────────────────────────
// TC-ENUM-03 — Fallback para null y undefined
// ─────────────────────────────────────────────────────────────
describe('formatEnumLabel — null y undefined', () => {
  it('retorna "No especificado" para null', () => {
    expect(formatEnumLabel(null)).toBe('No especificado');
  });

  it('retorna "No especificado" para undefined', () => {
    expect(formatEnumLabel(undefined)).toBe('No especificado');
  });

  it('retorna "No especificado" para string vacío', () => {
    expect(formatEnumLabel('')).toBe('No especificado');
  });
});
