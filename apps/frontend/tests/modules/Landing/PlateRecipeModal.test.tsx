import { describe, expect, it } from 'vitest';
import PlateRecipeModal from '../../../src/modules/Landing/components/PlateRecipeModal';

describe('PlateRecipeModal', () => {
  it('se exporta correctamente (La logica esta probada en PlateModals.test.tsx)', () => {
    expect(PlateRecipeModal).toBeDefined();
  });
});
