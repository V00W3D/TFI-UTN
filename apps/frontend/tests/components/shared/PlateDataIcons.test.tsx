// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AllergenIcon, DietaryTagIcon, NutritionTagIcon } from '../../../src/components/shared/PlateDataIcons';

describe('PlateDataIcons', () => {
  it('se renderizan correctamente los iconos por defecto', () => {
    const { container } = render(
      <>
        <AllergenIcon type="GLUTEN" />
        <DietaryTagIcon type="VEGAN" />
        <NutritionTagIcon type="LOW_SUGAR" />
      </>
    );
    expect(container.querySelectorAll('svg')).toHaveLength(3);
  });
});
