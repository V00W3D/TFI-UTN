// @vitest-environment jsdom
/**
 * @file SearchFilters.test.tsx
 * @module Search/Tests
 * @description Unit tests for SearchFilters component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: URLSearchParams, onReplaceParams callback
 * outputs: filter controls (sort, price, type, size, allergens, etc.)
 * rules: clear button resets all params; filter changes update params with page=1
 *
 * @technical
 * dependencies: @testing-library/react, vitest, @app/sdk, searchUrl
 * flow: render with empty params -> verify controls -> interact -> verify onReplaceParams called
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-SF-01, TC-FE-SF-02, TC-FE-SF-03
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock the landingPlateNutrition helper to avoid SDK deep deps
vi.mock('../../src/modules/Landing/components/landingPlateNutrition', () => ({
  formatLandingEnum: (v: string) => v,
}));

import { SearchFilters } from '../../../src/modules/Search/components/SearchFilters';

describe('SearchFilters', () => {
  const mockOnReplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-FE-SF-01: renderiza los controles principales de filtrado', () => {
    render(
      <SearchFilters
        searchParams={new URLSearchParams()}
        onReplaceParams={mockOnReplace}
      />
    );

    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByText('Limpiar')).toBeInTheDocument();
    expect(screen.getByText('Tipo de plato')).toBeInTheDocument();
    expect(screen.getByText('Tamaño')).toBeInTheDocument();
    expect(screen.getByText('Orden')).toBeInTheDocument();
    expect(screen.getByText('Sin alérgenos')).toBeInTheDocument();
  });

  it('TC-FE-SF-02: el boton Limpiar resetea todos los params', () => {
    render(
      <SearchFilters
        searchParams={new URLSearchParams('sort=price_asc&minPrice=100')}
        onReplaceParams={mockOnReplace}
      />
    );
    fireEvent.click(screen.getByText('Limpiar'));
    expect(mockOnReplace).toHaveBeenCalledWith(new URLSearchParams());
  });

  it('TC-FE-SF-03: cambio en el selector de orden llama onReplaceParams con el nuevo sort', () => {
    render(
      <SearchFilters
        searchParams={new URLSearchParams()}
        onReplaceParams={mockOnReplace}
      />
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'price_asc' } });
    expect(mockOnReplace).toHaveBeenCalled();
    const calledWith: URLSearchParams = mockOnReplace.mock.calls[0][0];
    expect(calledWith.get('sort')).toBe('price_asc');
  });
});
