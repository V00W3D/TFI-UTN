// @vitest-environment jsdom
/**
 * @file FeaturedDish.test.tsx
 * @module Landing/Tests
 * @description Unit tests for FeaturedDish component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: plates data from SDK
 * outputs: paginated menu section with modal details
 * rules: 3 plates per page; show full menu link in 'full' scope; show nutrition/recipe modals
 *
 * @technical
 * dependencies: @testing-library/react, vitest, sdk, framer-motion, react-router-dom
 * flow: mock sdk -> render -> verify states -> test pagination -> test modal triggers
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1.5
 *
 * @testing
 * cases: TC-FE-FD-01, TC-FE-FD-02, TC-FE-FD-03, TC-FE-FD-04
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FeaturedDish from '../../../src/modules/Landing/components/FeaturedDish';
import { sdk } from '../../../src/tools/sdk';
import { PUBLIC_APP_SCOPE } from '../../../src/qartEnv';

// Mock children
vi.mock('./PlateCard', () => ({
  default: ({ plate, onOpenNutrition, onOpenRecipe }: any) => (
    <div data-testid={`plate-card-${plate.id}`}>
      {plate.name}
      <button onClick={onOpenNutrition}>Nutrition</button>
      <button onClick={onOpenRecipe}>Recipe</button>
    </div>
  ),
}));

vi.mock('./PlateNutritionModal', () => ({
  default: ({ plate, onClose }: any) => (
    <div data-testid="nutrition-modal">
      Nutrition for {plate.name}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('./PlateRecipeModal', () => ({
  default: ({ plate, onClose }: any) => (
    <div data-testid="recipe-modal">
      Recipe for {plate.name}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// Mock SDK
vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    customers: {
      plates: Object.assign(vi.fn(), {
        $use: vi.fn(),
      }),
    },
  },
}));

// Mock Env
vi.mock('../../../src/qartEnv', () => ({
  PUBLIC_APP_SCOPE: 'full',
}));

describe('FeaturedDish', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPlates = Array.from({ length: 5 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Plate ${i + 1}`,
  }));

  it('TC-FE-FD-01: muestra estado de carga inicial', () => {
    (sdk.customers.plates.$use as any).mockReturnValue({ isFetching: true, data: null, error: null });
    render(
      <MemoryRouter>
        <FeaturedDish />
      </MemoryRouter>
    );
    expect(screen.getByText(/Estamos cargando el menú destacado/i)).toBeInTheDocument();
  });

  it('TC-FE-FD-02: muestra mensaje de error si falla la carga', () => {
    (sdk.customers.plates.$use as any).mockReturnValue({ isFetching: false, data: null, error: true });
    render(
      <MemoryRouter>
        <FeaturedDish />
      </MemoryRouter>
    );
    expect(screen.getByText(/No pudimos cargar los platos destacados/i)).toBeInTheDocument();
  });

  it('TC-FE-FD-03: renderiza platos y maneja paginación (3 por página)', () => {
    (sdk.customers.plates.$use as any).mockReturnValue({
      isFetching: false,
      data: { data: mockPlates },
      error: null,
    });

    render(
      <MemoryRouter>
        <FeaturedDish />
      </MemoryRouter>
    );

    // Initial page: plates 1, 2, 3
    expect(screen.getByTestId('plate-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('plate-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('plate-card-3')).toBeInTheDocument();
    expect(screen.queryByTestId('plate-card-4')).not.toBeInTheDocument();

    // Go to next page
    const nextBtn = screen.getByText('Siguiente');
    fireEvent.click(nextBtn);

    // Second page: plates 4, 5
    expect(screen.queryByTestId('plate-card-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('plate-card-4')).toBeInTheDocument();
    expect(screen.getByTestId('plate-card-5')).toBeInTheDocument();
  });

  it('TC-FE-FD-04: abre y cierra los modales de nutrición y receta', () => {
    (sdk.customers.plates.$use as any).mockReturnValue({
      isFetching: false,
      data: { data: [mockPlates[0]] },
      error: null,
    });

    render(
      <MemoryRouter>
        <FeaturedDish />
      </MemoryRouter>
    );

    // Open Nutrition
    fireEvent.click(screen.getByText('Nutrition'));
    expect(screen.getByTestId('nutrition-modal')).toBeInTheDocument();
    expect(screen.getByText('Nutrition for Plate 1')).toBeInTheDocument();

    // Close Nutrition
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('nutrition-modal')).not.toBeInTheDocument();

    // Open Recipe
    fireEvent.click(screen.getByText('Recipe'));
    expect(screen.getByTestId('recipe-modal')).toBeInTheDocument();
    expect(screen.getByText('Recipe for Plate 1')).toBeInTheDocument();
  });
});
