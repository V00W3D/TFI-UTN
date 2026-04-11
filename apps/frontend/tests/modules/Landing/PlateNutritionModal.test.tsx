import { describe, expect, it } from 'vitest';
import PlateNutritionModal from '../../../src/modules/Landing/components/PlateNutritionModal';

describe('PlateNutritionModal', () => {
  it('se exporta correctamente (La logica esta probada en PlateModals.test.tsx)', () => {
    expect(PlateNutritionModal).toBeDefined();
  });
});
