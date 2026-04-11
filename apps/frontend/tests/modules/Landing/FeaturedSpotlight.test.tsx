// @vitest-environment jsdom
/**
 * @file FeaturedSpotlight.test.tsx
 * @module Landing/Tests
 * @description Unit tests for FeaturedSpotlight (Favorites) section component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: featured plates data from SDK, OrderStore actions
 * outputs: top-3 favorites section with high-engagement actions
 * rules: show ratings and units sold; add to cart functionality; open distinct detail modals
 *
 * @technical
 * dependencies: @testing-library/react, vitest, sdk, orderStore, framer-motion, react-router-dom
 * flow: mock stores -> render -> verify ratings -> test add item -> test modal openings
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1.5
 *
 * @testing
 * cases: TC-FE-FS-01, TC-FE-FS-02, TC-FE-FS-03
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FeaturedSpotlight from '../../../src/modules/Landing/components/FeaturedSpotlight';
import { sdk } from '../../../src/tools/sdk';
import { useOrderStore } from '../../../src/orderStore';

// Mock stores
vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    customers: {
      featured: Object.assign(vi.fn(), {
        $use: vi.fn(),
      }),
    },
  },
}));

vi.mock('../../../src/orderStore', () => ({
  useOrderStore: vi.fn(),
}));

// Mock sub-modals
vi.mock('../../../src/modules/Landing/components/PlateNutritionModal', () => ({ default: () => <div data-testid="nutrition-modal" /> }));
vi.mock('../../../src/modules/Landing/components/PlateRecipeModal', () => ({ default: () => <div data-testid="recipe-modal" /> }));
vi.mock('../../../src/modules/Landing/components/PlateReviewsModal', () => ({ default: () => <div data-testid="reviews-modal" /> }));

describe('FeaturedSpotlight', () => {
  const mockAddItem = vi.fn();
  const mockSetOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useOrderStore as any).mockReturnValue({
      addItem: mockAddItem,
      setOpen: mockSetOpen,
    });
  });

  const mockPlates = [
    {
      id: 'p1',
      name: 'Favorite 1',
      avgRating: 4.8,
      ratingsCount: 120,
      unitsSold: 500,
      menuPrice: 1500,
      recipe: { type: 'burger' },
      imageUrl: '/img1.png',
    },
  ];

  it('TC-FE-FS-01: renderiza platos destacados con sus métricas', () => {
    (sdk.customers.featured.$use as any).mockReturnValue({
      isFetching: false,
      data: { data: mockPlates },
      error: null,
    });

    render(
      <MemoryRouter>
        <FeaturedSpotlight />
      </MemoryRouter>
    );

    expect(screen.getByText('Favorite 1')).toBeInTheDocument();
    expect(screen.getByText('500 pedidos')).toBeInTheDocument();
  });

  it('TC-FE-FS-02: permite agregar un plato al carrito directamente', () => {
    (sdk.customers.featured.$use as any).mockReturnValue({
      isFetching: false,
      data: { data: mockPlates },
      error: null,
    });

    render(
      <MemoryRouter>
        <FeaturedSpotlight />
      </MemoryRouter>
    );

    const addBtn = screen.getByText(/Agregar/i);
    fireEvent.click(addBtn);

    expect(mockAddItem).toHaveBeenCalledWith(mockPlates[0], 1);
    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });

  it('TC-FE-FS-03: dispara la apertura de los diferentes modales de detalle', () => {
    (sdk.customers.featured.$use as any).mockReturnValue({
      isFetching: false,
      data: { data: mockPlates },
      error: null,
    });

    render(
      <MemoryRouter>
        <FeaturedSpotlight />
      </MemoryRouter>
    );

    // Nutrition Info
    fireEvent.click(screen.getByTitle('Info'));
    expect(screen.getByTestId('nutrition-modal')).toBeInTheDocument();

    // Recipe/Arma
    fireEvent.click(screen.getByTitle('Arma'));
    expect(screen.getByTestId('recipe-modal')).toBeInTheDocument();

    // Reviews
    fireEvent.click(screen.getByTitle('Ver reseñas'));
    expect(screen.getByTestId('reviews-modal')).toBeInTheDocument();
  });
});
