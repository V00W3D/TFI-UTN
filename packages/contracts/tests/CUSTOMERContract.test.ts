/**
 * @file CUSTOMERContract.test.ts
 * @module Contracts/Tests
 * @description Tests unitarios expandidos para CUSTOMERContract.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18, RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: queries de búsqueda, payloads de dirección y respuestas paginadas
 * outputs: verificación de defaults, parseo de CSV, validación de UUIDs y paginación
 * rules: defaults de búsqueda (sort: name_asc, page: 1, pageSize: 24); CSV de tags se parsea como array; id de address debe ser UUID
 *
 * @technical
 * dependencies: vitest, @app/contracts (CUSTOMERContract)
 * flow: parsea queries con defaults; verifica transformaciones CSV; valida payloads de dirección; prueba paginación
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 *
 * @testing
 * cases: TC-CUSTOMER-CONTRACT-01, TC-CUSTOMER-CONTRACT-02
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se cubre el comportamiento de SearchPlatesQuerySchema exhaustivamente por su complejidad de filtros
 */
import { describe, expect, it } from 'vitest';
import {
  SearchPlatesQuerySchema,
  SearchPlatesResponseSchema,
  AddressSchema,
  CreateAddressSchema,
} from '../CUSTOMERContract';

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-01 — SearchPlatesQuerySchema defaults
// ─────────────────────────────────────────────────────────────
describe('SearchPlatesQuerySchema — defaults', () => {
  it('aplica defaults correctos cuando el objeto está vacío', () => {
    const parsed = SearchPlatesQuerySchema.parse({});
    expect(parsed.sort).toBe('name_asc');
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(24);
  });

  it('acepta sort alternativo', () => {
    const parsed = SearchPlatesQuerySchema.parse({ sort: 'rating_desc' });
    expect(parsed.sort).toBe('rating_desc');
  });

  it('acepta page y pageSize personalizados', () => {
    const parsed = SearchPlatesQuerySchema.parse({ page: 3, pageSize: 12 });
    expect(parsed.page).toBe(3);
    expect(parsed.pageSize).toBe(12);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-02 — SearchPlatesQuerySchema filtros CSV
// ─────────────────────────────────────────────────────────────
describe('SearchPlatesQuerySchema — filtros CSV', () => {
  it('parsea dietaryTags como CSV a array', () => {
    const parsed = SearchPlatesQuerySchema.parse({ dietaryTags: 'VEGAN,GLUTEN_FREE' });
    expect(parsed.dietaryTags).toEqual(['VEGAN', 'GLUTEN_FREE']);
  });

  it('parsea tagNames con espacios alrededor de las comas', () => {
    const parsed = SearchPlatesQuerySchema.parse({ tagNames: 'picante, proteico' });
    expect(parsed.tagNames).toEqual(['picante', 'proteico']);
  });

  it('parsea nutritionTags correctamente', () => {
    const parsed = SearchPlatesQuerySchema.parse({ nutritionTags: 'HIGH_PROTEIN' });
    expect(parsed.nutritionTags).toEqual(['HIGH_PROTEIN']);
  });

  it('parsea recipeDietaryTags correctamente', () => {
    const parsed = SearchPlatesQuerySchema.parse({ recipeDietaryTags: 'VEGETARIAN,VEGAN' });
    expect(parsed.recipeDietaryTags).toEqual(['VEGETARIAN', 'VEGAN']);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-03 — SearchPlatesQuerySchema filtros numéricos
// ─────────────────────────────────────────────────────────────
describe('SearchPlatesQuerySchema — filtros numéricos', () => {
  it('acepta minPrice y maxPrice como números', () => {
    const parsed = SearchPlatesQuerySchema.parse({ minPrice: 100, maxPrice: 5000 });
    expect(parsed.minPrice).toBe(100);
    expect(parsed.maxPrice).toBe(5000);
  });

  it('acepta minCalories y maxCalories', () => {
    const parsed = SearchPlatesQuerySchema.parse({ minCalories: 200, maxCalories: 800 });
    expect(parsed.minCalories).toBe(200);
    expect(parsed.maxCalories).toBe(800);
  });

  it('acepta minRating y minRatingsCount', () => {
    const parsed = SearchPlatesQuerySchema.parse({ minRating: 4.0, minRatingsCount: 5 });
    expect(parsed.minRating).toBe(4.0);
    expect(parsed.minRatingsCount).toBe(5);
  });

  it('filtros numéricos son undefined cuando no se proveen', () => {
    const parsed = SearchPlatesQuerySchema.parse({});
    expect(parsed.minPrice).toBeUndefined();
    expect(parsed.maxCalories).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-04 — AddressSchema
// ─────────────────────────────────────────────────────────────
describe('AddressSchema', () => {
  const validAddress = {
    id: '11111111-1111-4111-8111-111111111111',
    street: 'San Martín',
    number: '123',
    floorApt: null,
    notes: null,
    isDefault: true,
  };

  it('parsea dirección válida correctamente', () => {
    const result = AddressSchema.safeParse(validAddress);
    expect(result.success).toBe(true);
  });

  it('contiene los campos esperados tras el parseo', () => {
    const result = AddressSchema.parse(validAddress);
    expect(result.street).toBe('San Martín');
    expect(result.isDefault).toBe(true);
  });

  it('rechaza id que no es UUID', () => {
    const result = AddressSchema.safeParse({ ...validAddress, id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('acepta floorApt como string o null', () => {
    expect(AddressSchema.safeParse({ ...validAddress, floorApt: '3B' }).success).toBe(true);
    expect(AddressSchema.safeParse({ ...validAddress, floorApt: null }).success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-05 — CreateAddressInputSchema
// ─────────────────────────────────────────────────────────────
describe('CreateAddressSchema', () => {
  const validInput = {
    street: 'Corrientes',
    number: '1234',
    isDefault: false,
  };

  it('acepta input válido de nueva dirección', () => {
    expect(CreateAddressSchema.safeParse(validInput).success).toBe(true);
  });

  it('rechaza input sin street', () => {
    const { street: _s, ...withoutStreet } = validInput;
    expect(CreateAddressSchema.safeParse(withoutStreet).success).toBe(false);
  });

  it('rechaza input sin number', () => {
    const { number: _n, ...withoutNumber } = validInput;
    expect(CreateAddressSchema.safeParse(withoutNumber).success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-CUSTOMER-06 — SearchPlatesResponseSchema
// ─────────────────────────────────────────────────────────────
describe('SearchPlatesResponseSchema', () => {
  it('parsea respuesta paginada con items vacíos', () => {
    const result = SearchPlatesResponseSchema.safeParse({
      items: [],
      total: 0,
      page: 1,
      pageSize: 24,
    });
    expect(result.success).toBe(true);
  });

  it('total refleja el número de resultados', () => {
    const result = SearchPlatesResponseSchema.parse({
      items: [],
      total: 42,
      page: 2,
      pageSize: 24,
    });
    expect(result.total).toBe(42);
    expect(result.page).toBe(2);
  });

  it('rechaza respuesta sin campo total', () => {
    const result = SearchPlatesResponseSchema.safeParse({
      items: [],
      page: 1,
      pageSize: 24,
    });
    expect(result.success).toBe(false);
  });
});
