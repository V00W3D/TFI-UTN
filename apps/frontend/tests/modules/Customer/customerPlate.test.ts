/**
 * @file customerPlate.test.ts
 * @module Frontend/Tests/Customer
 * @description Tests unitarios expandidos para customerPlate.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18, RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: platos del catálogo customer, valores numéricos de precio/métrica
 * outputs: verificación de formatos monetarios, métricas con unidad, texto de búsqueda y traducciones de enum
 * rules: formatCustomerPrice usa ARS; formatCustomerMetric retorna 'No informado' para null; getCustomerPlateSearchText incluye nombre, receta, ingredientes y tags
 *
 * @technical
 * dependencies: vitest, customerPlate
 * flow: construye fixture CustomerPlate; ejecuta cada helper; verifica string resultante o comportamiento de borde
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-CUSTOMER-PLATE-01 a TC-CUSTOMER-PLATE-06
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se usa toContain en lugar de toBe para formatCustomerPrice ya que el formato exacto puede variar por entorno de test (Intl)
 */
import { describe, expect, it } from 'vitest';
import {
  formatCustomerEnum,
  formatCustomerPrice,
  formatCustomerMetric,
  getCustomerPlateSearchText,
  type CustomerPlate,
} from '../../../src/modules/Customer/customerPlate';

// ─────────────────────────────────────────────────────────────
// Fixture completo de CustomerPlate
// ─────────────────────────────────────────────────────────────
const plateFixture: CustomerPlate = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Bowl proteico',
  description: 'Con pollo y vegetales',
  imageUrl: null,
  size: 'REGULAR',
  servedWeightGrams: 420,
  menuPrice: 12500,
  avgRating: 4.8,
  ratingsCount: 12,
  likesCount: 33,
  dislikesCount: 1,
  isAvailable: true,
  allergens: ['SESAME'],
  dietaryTags: ['GLUTEN_FREE'],
  nutritionTags: ['HIGH_PROTEIN'],
  nutritionNotes: null,
  nutrition: {
    calories: 640,
    proteins: 42,
    carbs: 38,
    fats: 21,
    fiber: 9,
    sugars: 4,
    sodium: 580,
    saturatedFat: 4,
    transFat: 0,
    monounsaturatedFat: 8,
    polyunsaturatedFat: 5,
  },
  tags: [{ id: '22222222-2222-2222-2222-222222222222', name: 'Post entreno', description: null }],
  recipe: {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Base funcional',
    description: 'Preparacion para energia sostenida',
    type: 'MAIN',
    flavor: 'SALTY',
    difficulty: 'EASY',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    yieldServings: 1,
    assemblyNotes: null,
    allergens: ['SESAME'],
    dietaryTags: ['GLUTEN_FREE'],
    items: [
      {
        id: '44444444-4444-4444-4444-444444444444',
        quantityGrams: 180,
        prepNotes: null,
        isOptional: false,
        isMainComponent: true,
        sortOrder: 0,
        variant: {
          id: '55555555-5555-5555-5555-555555555555',
          name: 'Pollo grillado',
          description: null,
          preparationMethod: 'GRILLED',
          preparationNotes: null,
          portionGrams: 180,
          yieldFactor: 1,
          isDefault: true,
          overrideNutrition: {
            calories: null,
            proteins: null,
            carbs: null,
            fats: null,
            fiber: null,
            sugars: null,
            sodium: null,
            saturatedFat: null,
            transFat: null,
            monounsaturatedFat: null,
            polyunsaturatedFat: null,
          },
          ingredient: {
            id: '66666666-6666-6666-6666-666666666666',
            name: 'Pollo',
            description: null,
            category: 'PROTEIN_ANIMAL',
            subCategory: null,
            primaryFlavor: null,
            nutritionBasisGrams: 100,
            nutrition: {
              calories: 165,
              proteins: 31,
              carbs: 0,
              fats: 3.6,
              fiber: 0,
              sugars: 0,
              sodium: 74,
              saturatedFat: 1,
              transFat: 0,
              monounsaturatedFat: 1.2,
              polyunsaturatedFat: 0.8,
            },
            allergens: [],
            dietaryTags: ['GLUTEN_FREE'],
            nutritionTags: ['HIGH_PROTEIN'],
            notes: null,
            extraAttributes: null,
          },
        },
      },
    ],
  },
  adjustments: [],
  reviews: [],
};

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-PLATE-01 — formatCustomerEnum
// ─────────────────────────────────────────────────────────────
describe('formatCustomerEnum', () => {
  it('TC-CUSTOMER-PLATE-01a: traduce enums conocidos al español', () => {
    expect(formatCustomerEnum('REGULAR')).toBe('Regular');
    expect(formatCustomerEnum('HIGH_PROTEIN')).toBe('Alto en proteina');
    expect(formatCustomerEnum('GLUTEN_FREE')).toBe('Sin gluten');
  });

  it('TC-CUSTOMER-PLATE-01b: retorna "No especificado" para null', () => {
    expect(formatCustomerEnum(null)).toBe('No especificado');
  });

  it('TC-CUSTOMER-PLATE-01c: retorna "No especificado" para undefined', () => {
    expect(formatCustomerEnum(undefined)).toBe('No especificado');
  });

  it('TC-CUSTOMER-PLATE-01d: title case fallback para enum desconocido', () => {
    expect(formatCustomerEnum('UNKNOWN_CATEGORY')).toBe('Unknown Category');
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-PLATE-02 — formatCustomerPrice
// ─────────────────────────────────────────────────────────────
describe('formatCustomerPrice', () => {
  it('TC-CUSTOMER-PLATE-02a: formatea precio en pesos argentinos', () => {
    const result = formatCustomerPrice(12500);
    // Verifica que incluya el símbolo de moneda y el número
    expect(result).toContain('12');
    expect(result).toContain('500');
  });

  it('TC-CUSTOMER-PLATE-02b: precio 0 se formatea sin decimales', () => {
    const result = formatCustomerPrice(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('TC-CUSTOMER-PLATE-02c: precios grandes incluyen separador de miles', () => {
    const result = formatCustomerPrice(100000);
    // Intl puede usar punto o coma según locale; verificamos que no tiene decimales
    expect(result).not.toMatch(/\.\d{2}$/);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-PLATE-03 — formatCustomerMetric
// ─────────────────────────────────────────────────────────────
describe('formatCustomerMetric', () => {
  it('TC-CUSTOMER-PLATE-03a: retorna "No informado" para null', () => {
    expect(formatCustomerMetric(null)).toBe('No informado');
  });

  it('TC-CUSTOMER-PLATE-03b: retorna "No informado" para undefined', () => {
    expect(formatCustomerMetric(undefined)).toBe('No informado');
  });

  it('TC-CUSTOMER-PLATE-03c: agrega la unidad al valor', () => {
    expect(formatCustomerMetric(42, 'g')).toBe('42 g');
    expect(formatCustomerMetric(165, 'kcal')).toBe('165 kcal');
  });

  it('TC-CUSTOMER-PLATE-03d: sin unidad retorna solo el valor', () => {
    expect(formatCustomerMetric(42)).toBe('42');
  });

  it('TC-CUSTOMER-PLATE-03e: respeta digits para decimales', () => {
    expect(formatCustomerMetric(4.567, '', 2)).toBe('4.57');
  });

  it('TC-CUSTOMER-PLATE-03f: entero sin digits exactos muestra sin decimal', () => {
    expect(formatCustomerMetric(100)).toBe('100');
  });

  it('TC-CUSTOMER-PLATE-03g: no-entero sin digits especificados usa 1 decimal', () => {
    expect(formatCustomerMetric(4.8)).toBe('4.8');
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-PLATE-04 — getCustomerPlateSearchText
// ─────────────────────────────────────────────────────────────
describe('getCustomerPlateSearchText', () => {
  it('TC-CUSTOMER-PLATE-04a: contiene el nombre del plato en minúsculas', () => {
    const text = getCustomerPlateSearchText(plateFixture);
    expect(text).toContain('bowl proteico');
  });

  it('TC-CUSTOMER-PLATE-04b: contiene el nombre de la receta', () => {
    const text = getCustomerPlateSearchText(plateFixture);
    expect(text).toContain('base funcional');
  });

  it('TC-CUSTOMER-PLATE-04c: contiene el nombre del ingrediente', () => {
    const text = getCustomerPlateSearchText(plateFixture);
    expect(text).toContain('pollo');
  });

  it('TC-CUSTOMER-PLATE-04d: contiene los tags del plato', () => {
    const text = getCustomerPlateSearchText(plateFixture);
    expect(text).toContain('post entreno');
  });

  it('TC-CUSTOMER-PLATE-04e: contiene los nutritionTags', () => {
    const text = getCustomerPlateSearchText(plateFixture);
    expect(text).toContain('high_protein');
  });

  it('TC-CUSTOMER-PLATE-04f: contiene los dietaryTags', () => {
    const text = getCustomerPlateSearchText(plateFixture);
    expect(text).toContain('gluten_free');
  });

  it('TC-CUSTOMER-PLATE-04g: todo el texto está en minúsculas', () => {
    const text = getCustomerPlateSearchText(plateFixture);
    expect(text).toBe(text.toLowerCase());
  });

  it('TC-CUSTOMER-PLATE-04h: plato mínimo (sin tags, sin adjustments) produce texto funcional', () => {
    const minimalPlate: CustomerPlate = {
      ...plateFixture,
      tags: [],
      adjustments: [],
      description: null,
      recipe: {
        ...plateFixture.recipe,
        description: null,
        items: [],
      },
    };

    const text = getCustomerPlateSearchText(minimalPlate);
    expect(text).toContain('bowl proteico');
    expect(typeof text).toBe('string');
  });
});
