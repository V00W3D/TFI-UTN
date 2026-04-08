/**
 * @file landingPlateNutrition.test.ts
 * @module Landing/Tests
 * @description Unit tests for landing plate nutrition helpers — formatters, selectFeaturedMetrics, etc.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: nutriton values, enum strings, metric arrays
 * outputs: formatted strings, reordered metric lists
 * rules: prefer benefits, then risks; limit metrics to `limit`; format units per nutrient type
 *
 * @technical
 * dependencies: vitest, landingPlateNutrition
 * flow: call pure helper functions with known input -> assert output string or array
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-LANDING-NUTRITION-01 to TC-LANDING-NUTRITION-03
 * ultima prueba exitosa: 2026-04-08 15:10:00
 *
 * @notes
 * decisions: focuses on pure/exported helpers only; getPlateIngredientAnalysis depends on SDK internals and is integration-tested.
 */
import { describe, expect, it } from 'vitest';
import {
  formatLandingEnum,
  formatLandingPrice,
  formatLandingMetric,
  selectFeaturedMetrics,
} from '../../src/modules/Landing/components/landingPlateNutrition';
import type { NutritionTone } from '../../src/modules/Landing/components/landingPlateNutrition';

describe('landingPlateNutrition helpers', () => {
  it('TC-LANDING-NUTRITION-01: formatLandingEnum convierte enums a etiquetas', () => {
    expect(formatLandingEnum('PROTEIN_ANIMAL')).toBe('Protein Animal');
    expect(formatLandingEnum(null)).toBe('No especificado');
    expect(formatLandingEnum(undefined)).toBe('No especificado');
    expect(formatLandingEnum('REGULAR')).toBe('Regular'); // special SIZE_LABELS mapping
  });

  it('TC-LANDING-NUTRITION-02: formatLandingMetric formatea valores numéricos con unidades', () => {
    expect(formatLandingMetric(null)).toBe('No informado');
    expect(formatLandingMetric(undefined)).toBe('No informado');
    expect(formatLandingMetric(150, 'g', 0)).toBe('150 g');
    expect(formatLandingMetric(3.14, 'kcal', 1)).toBe('3.1 kcal');
  });

  it('TC-LANDING-NUTRITION-03: formatLandingPrice formatea en ARS con formato local', () => {
    const formatted = formatLandingPrice(1500);
    // We check the numeric presence, not the exact locale symbol (may vary by OS)
    expect(formatted).toContain('1.500');
  });

  it('TC-LANDING-NUTRITION-04: selectFeaturedMetrics prioriza benefits sobre risks sobre balanced', () => {
    const metrics = [
      { key: 'fats' as const, tone: 'balanced' as NutritionTone },
      { key: 'fiber' as const, tone: 'benefit' as NutritionTone },
      { key: 'sodium' as const, tone: 'danger' as NutritionTone },
      { key: 'sugars' as const, tone: 'caution' as NutritionTone },
      { key: 'carbs' as const, tone: 'balanced' as NutritionTone },
    ];

    const result = selectFeaturedMetrics(metrics, 3);
    expect(result).toHaveLength(3);
    // First is benefit
    expect(result[0].tone).toBe('benefit');
    // Second is danger (risk)
    expect(result[1].tone).toBe('danger');
  });
});
