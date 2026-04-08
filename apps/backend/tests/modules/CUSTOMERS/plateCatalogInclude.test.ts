/**
 * @file plateCatalogInclude.test.ts
 * @module CUSTOMERS/Tests
 * @description Unit tests for plate catalog include graph configuration.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-02
 * rnf: RNF-02
 *
 * @business
 * inputs: null
 * outputs: valid Prisma include object
 * rules: Must include active recipes, active variants, adjustments, recent reviews, and active tags.
 *
 * @technical
 * dependencies: vitest, plateCatalogInclude
 * flow: assert structure constraints
 *
 * @estimation
 * complexity: Low
 * fpa: ILF
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-B-PLATE-INCLUDE-01
 * ultima prueba exitosa: 2026-04-08 14:15:00
 *
 * @notes
 * decisions: focuses only on ensuring the configuration object doesn't regress.
 */
import { describe, expect, it } from 'vitest';
import { plateCatalogInclude } from '../../../src/modules/CUSTOMERS/services/plateCatalogInclude';

describe('plateCatalogInclude', () => {
  it('TC-B-PLATE-INCLUDE-01: exporta la configuración unificada correcta para Prisma', () => {
    // Assert crucial nested relations existence
    expect(plateCatalogInclude).toHaveProperty('recipe.include.items.where.variant.isActive', true);
    expect(plateCatalogInclude).toHaveProperty('tags.where.tag.isActive', true);
    expect(plateCatalogInclude).toHaveProperty('reviews.orderBy.createdAt', 'desc');
    expect(plateCatalogInclude).toHaveProperty('adjustments.orderBy.sortOrder', 'asc');
  });
});
