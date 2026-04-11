// @vitest-environment jsdom
/**
 * @file SearchPage.test.tsx
 * @module Search/Tests
 * @description Unit tests for SearchPage component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: URL search params, SDK response data, appStore module
 * outputs: paginated plate grid, filter sidebar, error banner, modals
 * rules: setModule('LANDING') on mount; show results count; paginate; open modals per plate
 *
 * @technical
 * dependencies: @testing-library/react, vitest, react-router-dom, appStore, sdk
 * flow: mock SDK use hook -> render in MemoryRouter -> verify header/grid/error/pagination
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-FE-SP-01, TC-FE-SP-02, TC-FE-SP-03
 *
 * @notes
 * decisions: sdk.$use() hook intercepted via vi.mock to control isFetching/error/data states
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mocks hoisted before imports
vi.mock('../../../src/appStore', () => ({ useAppStore: vi.fn() }));
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('../../../src/modules/Landing/components/Navbar', () => ({
  default: () => <nav data-testid="navbar" />,
}));
vi.mock('../../../src/modules/Landing/components/OrderPanel', () => ({
  default: () => <div data-testid="order-panel" />,
}));
vi.mock('../../../src/modules/Landing/components/PlateNutritionModal', () => ({
  default: () => <div data-testid="nutrition-modal" />,
}));
vi.mock('../../../src/modules/Landing/components/PlateRecipeModal', () => ({
  default: () => <div data-testid="recipe-modal" />,
}));
vi.mock('../../../src/modules/Landing/components/PlateReviewsModal', () => ({
  default: () => <div data-testid="reviews-modal" />,
}));
vi.mock('../../../src/modules/Search/components/SearchFilters', () => ({
  SearchFilters: () => <div data-testid="search-filters" />,
}));
vi.mock('../../../src/modules/Search/components/SearchPlateCard', () => ({
  SearchPlateCard: ({ plate }: any) => (
    <article data-testid="plate-card">{plate.name}</article>
  ),
}));
vi.mock('../../../src/modules/Landing/LandingPages.css', () => ({}));
vi.mock('../../../src/components/shared/AppIcons', () => ({
  ArrowLeftIcon: () => <span />,
}));

vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    customers: {
      search: Object.assign(vi.fn().mockResolvedValue({ status: 200 }), {
        $use: vi.fn(),
      }),
    },
  },
}));

import SearchPage from '../../../src/modules/Search/pages/SearchPage';
import { useAppStore } from '../../../src/appStore';
import { sdk } from '../../../src/tools/sdk';

describe('SearchPage', () => {
  const mockSetModule = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({ setModule: mockSetModule });
  });

  it('TC-FE-SP-01: registra el modulo y muestra el header al cargar', () => {
    (sdk.customers.search.$use as any).mockReturnValue({
      isFetching: false,
      error: null,
      data: null,
    });

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(mockSetModule).toHaveBeenCalledWith('LANDING');
    expect(screen.getByText('Menú completo')).toBeInTheDocument();
    expect(screen.getByTestId('search-filters')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('TC-FE-SP-02: muestra el conteo de resultados cuando hay plates', () => {
    (sdk.customers.search.$use as any).mockReturnValue({
      isFetching: false,
      error: null,
      data: {
        data: {
          items: [
            { id: 'p1', name: 'Pizza Margherita' },
            { id: 'p2', name: 'Pasta Carbonara' },
          ],
          total: 2,
          page: 1,
          pageSize: 12,
        },
      },
    });

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByText('2 resultados')).toBeInTheDocument();
    expect(screen.getAllByTestId('plate-card')).toHaveLength(2);
    expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
  });

  it('TC-FE-SP-03: muestra el banner de error cuando el SDK falla', () => {
    (sdk.customers.search.$use as any).mockReturnValue({
      isFetching: false,
      error: new Error('Network error'),
      data: null,
    });

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/No pudimos cargar el menú/i)).toBeInTheDocument();
  });

  it('TC-FE-SP-04: muestra Buscando mientras isFetching es true', () => {
    (sdk.customers.search.$use as any).mockReturnValue({
      isFetching: true,
      error: null,
      data: null,
    });

    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Buscando…')).toBeInTheDocument();
  });
});
