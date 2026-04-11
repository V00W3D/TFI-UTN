// @vitest-environment jsdom
/**
 * @file PlateModals.test.tsx
 * @module Landing/Tests
 * @description Unit tests for informational modals (Nutrition, Recipe, Reviews).
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: plate data, user session, hasTried state
 * outputs: data display, gates for reviews, submission of reviews
 * rules: check auth for reviews; check if plate was tried for reviews; display metrics/ingredients
 *
 * @technical
 * dependencies: @testing-library/react, vitest, orderStore, appStore, sdk, framer-motion
 * flow: mock dependencies -> render each modal -> verify specialized content
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 3
 *
 * @testing
 * cases: TC-FE-PM-01, TC-FE-PM-02, TC-FE-PM-03, TC-FE-PM-04, TC-FE-PM-05
 *
 * @notes
 * decisions: landingPlateNutrition helpers are mocked to decouple from SDK analyzePlateNutrition
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// ─── Mocks declared BEFORE component imports (vi.mock is hoisted) ──────────

// Mock Portal to render children inline
vi.mock('../../../src/components/shared/Portal', () => ({
  default: ({ children }: any) => <div data-testid="portal-root">{children}</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, ...props }: any) => (
      <div onClick={onClick} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock shared PlateDataIcons
vi.mock('../../../src/components/shared/PlateDataIcons', () => ({
  PlateDataIcon: () => <span data-testid="plate-icon" />,
  PlateDifficultyIcon: () => <span data-testid="diff-icon" />,
  StarRatingDisplay: ({ reviewCount }: any) => (
    <span data-testid="stars">{reviewCount != null ? `${reviewCount} reseñas` : ''}</span>
  ),
  getIngredientIconKey: () => 'ingredient',
}));

// Mock landingPlateNutrition helpers to avoid deep SDK dependencies
vi.mock('../../../src/modules/Landing/components/landingPlateNutrition', () => ({
  formatLandingPrice: (v: number) => `$ ${v}`,
  formatLandingEnum: (v: string) => v,
  formatLandingMetric: (v: number, unit: string) => `${v} ${unit}`,
  getPlateIngredientAnalysis: (_plate: any) => ({
    servings: 1,
    marketingHeadline: 'Plato sabroso',
    marketingSummary: 'Lectura nutricional completa.',
    totalMetrics: [],
    referenceRows: [],
    qualitativeReferenceNotes: [],
    ingredients: [],
  }),
  getPlateRecipeGuide: (_plate: any) => ({
    servings: 1,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    summary: 'Version de cocina abierta.',
    ingredients: [
      {
        id: 'i1',
        name: 'Agua',
        icon: 'ingredient',
        categoryLabel: 'Liquido',
        quantityGrams: 100,
        variants: [],
        preparations: [],
        note: null,
        isMainComponent: true,
      },
    ],
    steps: [
      { id: 's1', title: 'Paso inicial', body: 'Preparar todo.', note: null },
    ],
  }),
  selectFeaturedMetrics: () => [],
}));

// Mock sdk
vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    customers: {
      reviews: vi.fn(),
    },
  },
}));

// Mock Stores
vi.mock('../../../src/appStore', () => ({ useAppStore: vi.fn() }));
vi.mock('../../../src/orderStore', () => ({ useOrderStore: vi.fn() }));

// ─── Component imports (after mocks) ─────────────────────────────────────────
import PlateNutritionModal from '../../../src/modules/Landing/components/PlateNutritionModal';
import PlateRecipeModal from '../../../src/modules/Landing/components/PlateRecipeModal';
import PlateReviewsModal from '../../../src/modules/Landing/components/PlateReviewsModal';
import { useAppStore } from '../../../src/appStore';
import { useOrderStore } from '../../../src/orderStore';
import { sdk } from '../../../src/tools/sdk';

// ─── Shared mock plate ────────────────────────────────────────────────────────
const mockPlate: any = {
  id: 'p1',
  name: 'Garras de Leon',
  menuPrice: 2500,
  servedWeightGrams: 500,
  description: 'Un plato legendario',
  imageUrl: null,
  isAvailable: true,
  size: 'REGULAR',
  avgRating: 4.5,
  ratingsCount: 12,
  dietaryTags: ['VEGAN'],
  nutritionTags: ['LOW_FAT'],
  adjustments: [],
  recipe: {
    type: 'MEAT',
    difficulty: 'MEDIUM',
    assemblyNotes: 'Ensamblar con cuidado',
    description: 'Descripción de receta',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    items: [],
  },
  reviews: [
    {
      id: 'r1',
      rating: 5,
      comment: 'Excelente plato',
      createdAt: new Date('2024-01-15').toISOString(),
      recommends: true,
      reviewer: { displayName: 'Usuario A', avatarUrl: null },
    },
  ],
};

const onClose = vi.fn();

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('PlateNutritionModal', () => {
  it('TC-FE-PM-01: muestra el nombre del plato y el encabezado de ficha nutricional', () => {
    render(<PlateNutritionModal plate={mockPlate} onClose={onClose} />);

    expect(screen.getByText('Ficha nutricional')).toBeInTheDocument();
    expect(screen.getByText('Garras de Leon')).toBeInTheDocument();
    expect(screen.getByText('Plato sabroso')).toBeInTheDocument();
  });

  it('TC-FE-PM-01b: el boton Cerrar invoca onClose', () => {
    render(<PlateNutritionModal plate={mockPlate} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cerrar'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('PlateRecipeModal', () => {
  it('TC-FE-PM-02: muestra ingredientes y pasos generados por getPlateRecipeGuide', () => {
    render(<PlateRecipeModal plate={mockPlate} onClose={onClose} />);

    expect(screen.getByText('Receta abierta')).toBeInTheDocument();
    expect(screen.getByText('Agua')).toBeInTheDocument();
    expect(screen.getByText('Paso inicial')).toBeInTheDocument();
    expect(screen.getByText('Preparar todo.')).toBeInTheDocument();
  });

  it('TC-FE-PM-02b: muestra tiempos de prep y coccion', () => {
    render(<PlateRecipeModal plate={mockPlate} onClose={onClose} />);
    expect(screen.getAllByText(/15 min/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/20 min/i).length).toBeGreaterThan(0);
  });
});

describe('PlateReviewsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-FE-PM-03: lista las reseñas existentes', () => {
    (useAppStore as any).mockImplementation((selector: any) => selector({ user: null }));
    (useOrderStore as any).mockImplementation((selector: any) =>
      selector({ hasTriedPlate: () => false })
    );

    render(
      <MemoryRouter>
        <PlateReviewsModal plate={mockPlate} onClose={onClose} />
      </MemoryRouter>
    );

    expect(screen.getByText('Reseñas')).toBeInTheDocument();
    expect(screen.getByText('Usuario A')).toBeInTheDocument();
    expect(screen.getByText('Excelente plato')).toBeInTheDocument();
    expect(screen.getByText('Recomienda')).toBeInTheDocument();
  });

  it('TC-FE-PM-03b: gate de autenticacion al intentar publicar sin sesion', () => {
    (useAppStore as any).mockImplementation((selector: any) => selector({ user: null }));
    (useOrderStore as any).mockImplementation((selector: any) =>
      selector({ hasTriedPlate: () => false })
    );

    render(
      <MemoryRouter>
        <PlateReviewsModal plate={mockPlate} onClose={onClose} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Publicar mi reseña'));

    expect(screen.getByText(/no tenés una sesión abierta/i)).toBeInTheDocument();
    expect(screen.getByText('Ingresar')).toBeInTheDocument();
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
  });

  it('TC-FE-PM-04: gate de plato no probado cuando usuario logueado no ha pedido el plato', () => {
    (useAppStore as any).mockImplementation((selector: any) =>
      selector({ user: { id: 'u1', name: 'Test' } })
    );
    (useOrderStore as any).mockImplementation((selector: any) =>
      selector({ hasTriedPlate: () => false })
    );

    render(
      <MemoryRouter>
        <PlateReviewsModal plate={mockPlate} onClose={onClose} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Publicar mi reseña'));

    expect(
      screen.getByText(/Todavía no registramos que hayas pedido este plato/i)
    ).toBeInTheDocument();
  });

  it('TC-FE-PM-05: usuario logueado que probo el plato puede publicar una reseña', async () => {
    (useAppStore as any).mockImplementation((selector: any) =>
      selector({ user: { id: 'u1', name: 'Test' } })
    );
    (useOrderStore as any).mockImplementation((selector: any) =>
      selector({ hasTriedPlate: () => true })
    );
    (sdk.customers.reviews as any).mockResolvedValue({
      status: 200,
      data: { id: 'new-review-id' },
    });

    render(
      <MemoryRouter>
        <PlateReviewsModal plate={mockPlate} onClose={onClose} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Publicar mi reseña'));
    expect(screen.getByText('Tu voz suma al menú. Sé honesto y concreto.')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/¿Qué te pareció el plato?/i);
    fireEvent.change(textarea, { target: { value: 'Muy rico todo' } });

    fireEvent.click(screen.getByText('Publicar reseña'));

    await waitFor(() => {
      expect(sdk.customers.reviews).toHaveBeenCalledWith(
        expect.objectContaining({ plateId: 'p1', comment: 'Muy rico todo' })
      );
    });
  });
});
