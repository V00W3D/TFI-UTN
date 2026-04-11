// @vitest-environment jsdom
/**
 * @file SearchPlateCard.test.tsx
 * @module Search/Tests
 * @description Unit tests for SearchPlateCard component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: LandingPlate, onNutrition/onRecipe/onReviews callbacks
 * outputs: plate name, price, add-to-cart, info/review buttons
 * rules: clicking add calls addItem+setOpen; modal buttons invoke callbacks
 *
 * @technical
 * dependencies: @testing-library/react, vitest, orderStore, appStore
 * flow: mock stores -> render -> verify display -> click actions -> verify callbacks
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-SPC-01, TC-FE-SPC-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../../../src/orderStore', () => ({ useOrderStore: vi.fn() }));
vi.mock('../../../src/appStore', () => ({ useAppStore: vi.fn() }));
vi.mock('../../../src/modules/Landing/components/landingPlateNutrition', () => ({
  formatLandingEnum: (v: string) => v,
  formatLandingPrice: (v: number) => `$${v}`,
}));

import { SearchPlateCard } from '../../../src/modules/Search/components/SearchPlateCard';
import { useOrderStore } from '../../../src/orderStore';
import { useAppStore } from '../../../src/appStore';

const mockPlate: any = {
  id: 'p1',
  name: 'Milanesa Clásica',
  menuPrice: 1800,
  imageUrl: null,
  avgRating: 4.8,
  recipe: { type: 'MAIN' },
};

describe('SearchPlateCard', () => {
  const mockAddItem = vi.fn();
  const mockSetOpen = vi.fn();
  const mockOnNutrition = vi.fn();
  const mockOnRecipe = vi.fn();
  const mockOnReviews = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useOrderStore as any).mockReturnValue({ addItem: mockAddItem, setOpen: mockSetOpen });
    (useAppStore as any).mockReturnValue({ simpleMode: false });
  });

  it('TC-FE-SPC-01: muestra nombre, tipo y precio del plato', () => {
    render(
      <SearchPlateCard
        plate={mockPlate}
        onNutrition={mockOnNutrition}
        onRecipe={mockOnRecipe}
        onReviews={mockOnReviews}
      />
    );
    expect(screen.getByText('Milanesa Clásica')).toBeInTheDocument();
    expect(screen.getByText('$1800')).toBeInTheDocument();
    expect(screen.getByText('MAIN')).toBeInTheDocument();
  });

  it('TC-FE-SPC-02: SUMAR llama a addItem y setOpen', () => {
    render(
      <SearchPlateCard
        plate={mockPlate}
        onNutrition={mockOnNutrition}
        onRecipe={mockOnRecipe}
        onReviews={mockOnReviews}
      />
    );
    fireEvent.click(screen.getByText('SUMAR'));
    expect(mockAddItem).toHaveBeenCalledWith(mockPlate, 1);
    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });

  it('TC-FE-SPC-03: boton de reseñas invoca onReviews', () => {
    render(
      <SearchPlateCard
        plate={mockPlate}
        onNutrition={mockOnNutrition}
        onRecipe={mockOnRecipe}
        onReviews={mockOnReviews}
      />
    );
    fireEvent.click(screen.getByTitle('Ver reseñas'));
    expect(mockOnReviews).toHaveBeenCalled();
  });

  it('TC-FE-SPC-04: en simpleMode se ocultan los botones de nutricion y receta', () => {
    (useAppStore as any).mockReturnValue({ simpleMode: true });
    render(
      <SearchPlateCard
        plate={mockPlate}
        onNutrition={mockOnNutrition}
        onRecipe={mockOnRecipe}
        onReviews={mockOnReviews}
      />
    );
    expect(screen.queryByTitle('Info nutricional')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Receta')).not.toBeInTheDocument();
    // Reviews and add button still present
    expect(screen.getByTitle('Ver reseñas')).toBeInTheDocument();
    expect(screen.getByText('SUMAR')).toBeInTheDocument();
  });
});
