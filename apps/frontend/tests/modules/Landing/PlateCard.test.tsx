// @vitest-environment jsdom
/**
 * @file PlateCard.test.tsx
 * @module Landing/Tests
 * @description Unit tests for PlateCard component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: plate data, onOpenNutrition/onOpenRecipe callbacks
 * outputs: addItem to store, quantity updates, click events
 * rules: addItem with current quantity; trigger modals on click; handle availability
 *
 * @technical
 * dependencies: @testing-library/react, vitest, orderStore, PlateDataIcons
 * flow: render -> increase quantity -> click add -> verify store call -> verify modal callbacks
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-FE-PC-01, TC-FE-PC-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import PlateCard from '../../../src/modules/Landing/components/PlateCard';
import { useOrderStore } from '../../../src/orderStore';

// Mock specific shared components
vi.mock('../../../src/components/shared/PlateDataIcons', () => ({
  PlateDataIcon: () => <div data-testid="plate-icon" />,
  PlateDifficultyIcon: () => <div data-testid="diff-icon" />,
  StarRatingDisplay: () => <div data-testid="stars" />,
  getPlateSizeIconKey: () => 'size-icon',
  getPlateTypeIconKey: () => 'type-icon',
}));

// Mock Store
vi.mock('../../../src/orderStore', () => ({
  useOrderStore: vi.fn(),
}));

describe('PlateCard', () => {
  const mockAddItem = vi.fn();
  const mockSetOpen = vi.fn();
  const mockOnOpenNutrition = vi.fn();
  const mockOnOpenRecipe = vi.fn();

  const mockPlate: any = {
    id: 'p1',
    name: 'Garras de Leon',
    description: 'Delicioso plato ancestral',
    menuPrice: 2500,
    imageUrl: 'http://test.com/img.jpg',
    isAvailable: true,
    size: 'REGULAR',
    avgRating: 4.5,
    ratingsCount: 12,
    recipe: {
      type: 'MEAT',
      difficulty: 'MEDIUM',
      description: '...',
    },
    reviews: [],
    adjustments: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useOrderStore as any).mockReturnValue({
      addItem: mockAddItem,
      setOpen: mockSetOpen,
    });
  });

  it('TC-FE-PC-01: permite incrementar cantidad y añadir al pedido', () => {
    render(<PlateCard plate={mockPlate} onOpenNutrition={mockOnOpenNutrition} onOpenRecipe={mockOnOpenRecipe} />);

    // Incrementar cantidad
    const plusBtn = screen.getByLabelText('Aumentar cantidad');
    fireEvent.click(plusBtn); // 1 -> 2
    
    // Buscar input y verificar
    const qtyInput = screen.getByLabelText('Cantidad') as HTMLInputElement;
    expect(qtyInput.value).toBe('2');

    // Añadir al pedido
    const addBtn = screen.getByText('Añadir');
    fireEvent.click(addBtn);

    expect(mockAddItem).toHaveBeenCalledWith(mockPlate, 2);
    expect(mockSetOpen).toHaveBeenCalledWith(true);
    expect(screen.getByText('¡Añadido!')).toBeInTheDocument();
  });

  it('TC-FE-PC-02: dispara los callbacks de informacion nutricional y receta', () => {
    render(<PlateCard plate={mockPlate} onOpenNutrition={mockOnOpenNutrition} onOpenRecipe={mockOnOpenRecipe} />);

    // Click nutricion
    const nutritionBtn = screen.getByTitle('Información nutricional');
    fireEvent.click(nutritionBtn);
    expect(mockOnOpenNutrition).toHaveBeenCalled();

    // Click receta
    const recipeBtn = screen.getByTitle('Receta');
    fireEvent.click(recipeBtn);
    expect(mockOnOpenRecipe).toHaveBeenCalled();
  });

  it('TC-FE-PC-03: maneja estado de no disponible', () => {
    const unavailablePlate = { ...mockPlate, isAvailable: false };
    render(<PlateCard plate={unavailablePlate} onOpenNutrition={mockOnOpenNutrition} onOpenRecipe={mockOnOpenRecipe} />);

    expect(screen.getByText('Fuera de carta')).toBeInTheDocument();
    const addBtn = screen.getByRole('button', { name: /añadir/i });
    expect(addBtn).toBeDisabled();
  });
});
