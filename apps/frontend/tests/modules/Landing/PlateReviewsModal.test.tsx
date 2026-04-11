import { describe, expect, it } from 'vitest';
import PlateReviewsModal from '../../../src/modules/Landing/components/PlateReviewsModal';

describe('PlateReviewsModal', () => {
  it('se exporta correctamente (La logica esta probada en PlateModals.test.tsx)', () => {
    expect(PlateReviewsModal).toBeDefined();
  });
});
