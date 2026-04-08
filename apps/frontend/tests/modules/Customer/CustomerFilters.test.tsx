// @vitest-environment jsdom
/**
 * @file CustomerFilters.test.tsx
 * @description Unit tests for CustomerFilters component.
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CustomerFilters from '../../../src/modules/Customer/components/CustomerFilters';

describe('CustomerFilters', () => {
  it('TC-FE-CF-01: permite cambiar la búsqueda y el filtro de disponibilidad', () => {
    const onSearchChange = vi.fn();
    const onOnlyAvailableChange = vi.fn();

    render(
      <CustomerFilters
        search=""
        onlyAvailable={false}
        totalPlates={10}
        visiblePlates={5}
        onSearchChange={onSearchChange}
        onOnlyAvailableChange={onOnlyAvailableChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Ej: ensalada/i);
    fireEvent.change(searchInput, { target: { value: 'pollo' } });
    expect(onSearchChange).toHaveBeenCalledWith('pollo');

    const checkbox = screen.getByLabelText(/Mostrar solo platos disponibles/i);
    fireEvent.click(checkbox);
    expect(onOnlyAvailableChange).toHaveBeenCalledWith(true);

    expect(screen.getByText(/Viendo 5 de 10 platos/i)).toBeInTheDocument();
  });
});
