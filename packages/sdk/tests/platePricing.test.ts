/**
 * @file platePricing.test.ts
 * @module SDK/Tests
 * @description Tests unitarios expandidos para platePricing.ts.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-15, RF-16
 * rnf: RNF-03
 *
 * @business
 * inputs: ingredientes con procurement, receta con items y ajustes
 * outputs: análisis de precios con markup, IVA y precio de menú
 * rules: costPrice < netPrice < salePrice; salePrice con IVA; menuPrice aplica margen final; sin procurement → costPrice 0
 *
 * @technical
 * dependencies: vitest, @app/sdk (platePricing)
 * flow: construye fixtures con/sin procurement; ejecuta analyzePlatePricing; verifica invariantes de precio
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-PRICING-01, TC-PRICING-02, TC-PRICING-03, TC-PRICING-04
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se verifica la invariante menuPrice > netPrice > costPrice para cualquier input con procurement válido
 */
import { describe, expect, it } from 'vitest';
import { analyzePlatePricing, calculateIngredientSalePrice } from '../platePricing';

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────
const baseVariant = {
  id: 'variant-1',
  name: 'Pechuga grillada',
  description: null,
  preparationMethod: 'GRILLED',
  preparationNotes: null,
  portionGrams: 200,
  yieldFactor: 1,
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
    id: 'ingredient-1',
    name: 'Pollo',
    description: null,
    category: 'PROTEIN_ANIMAL',
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
      monounsaturatedFat: 1,
      polyunsaturatedFat: 0.8,
    },
    allergens: [],
    dietaryTags: [],
    nutritionTags: ['HIGH_PROTEIN'],
    notes: null,
    extraAttributes: {
      procurement: {
        pricingBasisGrams: 100,
        unitCostNet: 2400,
        purchaseUnitLabel: 'kg',
        supplierName: 'Proveedor A',
      },
    },
  },
};

const variantWithoutProcurement = {
  ...baseVariant,
  id: 'variant-no-proc',
  ingredient: {
    ...baseVariant.ingredient,
    id: 'ingredient-no-proc',
    extraAttributes: null,
  },
};

const recipeBase = {
  yieldServings: 1,
  items: [
    {
      id: 'item-1',
      quantityGrams: 200,
      prepNotes: null,
      isOptional: false,
      isMainComponent: true,
      sortOrder: 0,
      variant: baseVariant,
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// TC-PRICING-01 — calculateIngredientSalePrice
// ─────────────────────────────────────────────────────────────
describe('calculateIngredientSalePrice', () => {
  it('calcula precio final con markup, IVA y redondeo comercial', () => {
    const result = calculateIngredientSalePrice({
      pricingBasisGrams: 1,
      unitCostNet: 1000,
      purchaseUnitLabel: 'unidad',
      supplierKey: null,
      supplierName: null,
    });

    expect(result.costPrice).toBe(1000);
    expect(result.netPrice).toBe(1300);
    expect(result.salePrice).toBe(1600);
  });

  it('netPrice > costPrice siempre', () => {
    const result = calculateIngredientSalePrice({
      pricingBasisGrams: 100,
      unitCostNet: 2400,
      purchaseUnitLabel: 'kg',
      supplierKey: null,
      supplierName: null,
    });

    expect(result.netPrice).toBeGreaterThan(result.costPrice);
  });

  it('salePrice > netPrice siempre (incluye IVA)', () => {
    const result = calculateIngredientSalePrice({
      pricingBasisGrams: 100,
      unitCostNet: 2400,
      purchaseUnitLabel: 'kg',
      supplierKey: null,
      supplierName: null,
    });

    expect(result.salePrice).toBeGreaterThan(result.netPrice);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-PRICING-02 — analyzePlatePricing con procurement completo
// ─────────────────────────────────────────────────────────────
describe('analyzePlatePricing — con procurement', () => {
  it('produce costPrice mayor que 0 cuando hay datos de procurement', () => {
    const analysis = analyzePlatePricing({ recipe: recipeBase, adjustments: [] });
    expect(analysis.costPrice).toBeGreaterThan(0);
  });

  it('menuPrice > netPrice > costPrice (invariante de pricing)', () => {
    const analysis = analyzePlatePricing({ recipe: recipeBase, adjustments: [] });
    expect(analysis.costPrice).toBeGreaterThan(0);
    expect(analysis.netPrice).toBeGreaterThan(analysis.costPrice);
    expect(analysis.menuPrice).toBeGreaterThan(analysis.netPrice);
  });

  it('taxAmount es positivo', () => {
    const analysis = analyzePlatePricing({ recipe: recipeBase, adjustments: [] });
    expect(analysis.taxAmount).toBeGreaterThan(0);
  });

  it('ingredientBreakdown contiene un ítem por ingrediente único', () => {
    const analysis = analyzePlatePricing({ recipe: recipeBase, adjustments: [] });
    expect(analysis.ingredientBreakdown).toHaveLength(1);
  });

  it('missingIngredientIds está vacío cuando hay procurement en todos', () => {
    const analysis = analyzePlatePricing({ recipe: recipeBase, adjustments: [] });
    expect(analysis.missingIngredientIds).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────
// TC-PRICING-03 — analyzePlatePricing sin procurement
// ─────────────────────────────────────────────────────────────
describe('analyzePlatePricing — sin procurement', () => {
  const recipeNoProcurement = {
    yieldServings: 1,
    items: [
      {
        id: 'item-no-proc',
        quantityGrams: 200,
        prepNotes: null,
        isOptional: false,
        isMainComponent: true,
        sortOrder: 0,
        variant: variantWithoutProcurement,
      },
    ],
  };

  it('costPrice es 0 cuando no hay procurement', () => {
    const analysis = analyzePlatePricing({ recipe: recipeNoProcurement, adjustments: [] });
    expect(analysis.costPrice).toBe(0);
  });

  it('missingIngredientIds contiene el id del ingrediente sin datos', () => {
    const analysis = analyzePlatePricing({ recipe: recipeNoProcurement, adjustments: [] });
    expect(analysis.missingIngredientIds).toContain('ingredient-no-proc');
  });
});

// ─────────────────────────────────────────────────────────────
// TC-PRICING-04 — analyzePlatePricing con múltiples items
// ─────────────────────────────────────────────────────────────
describe('analyzePlatePricing — múltiples items', () => {
  const riceVariant = {
    ...baseVariant,
    id: 'variant-rice',
    ingredient: {
      ...baseVariant.ingredient,
      id: 'ingredient-rice',
      name: 'Arroz',
      extraAttributes: {
        procurement: {
          pricingBasisGrams: 100,
          unitCostNet: 800,
          purchaseUnitLabel: 'kg',
          supplierName: 'Proveedor B',
        },
      },
    },
  };

  const recipeMultipleItems = {
    yieldServings: 1,
    items: [
      {
        id: 'item-chicken',
        quantityGrams: 150,
        prepNotes: null,
        isOptional: false,
        isMainComponent: true,
        sortOrder: 0,
        variant: baseVariant,
      },
      {
        id: 'item-rice',
        quantityGrams: 100,
        prepNotes: null,
        isOptional: false,
        isMainComponent: false,
        sortOrder: 1,
        variant: riceVariant,
      },
    ],
  };

  it('ingredientBreakdown tiene un ítem por ingrediente', () => {
    const analysis = analyzePlatePricing({ recipe: recipeMultipleItems, adjustments: [] });
    expect(analysis.ingredientBreakdown).toHaveLength(2);
  });

  it('costPrice con dos ingredientes es mayor que 0', () => {
    const multiItemAnalysis = analyzePlatePricing({ recipe: recipeMultipleItems, adjustments: [] });
    // Tanto pollo como arroz tienen procurement → costPrice total debe ser positivo
    expect(multiItemAnalysis.costPrice).toBeGreaterThan(0);
  });
});
