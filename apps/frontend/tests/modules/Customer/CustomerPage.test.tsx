// @vitest-environment jsdom
/**
 * @file CustomerPage.test.tsx
 * @description Unit tests for CustomerPage.
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CustomerPage from '../../../src/modules/Customer/pages/CustomerPage';
import { useAppStore } from '../../../src/appStore';
import { sdk } from '../../../src/tools/sdk';

// --- MOCKS ---

vi.mock('../../../src/appStore', () => ({
  useAppStore: vi.fn(),
}));

vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    customers: {
      plates: Object.assign(vi.fn(), {
        $use: vi.fn(),
      }),
    },
  },
}));

// Mock sub-components
vi.mock('@modules/Customer/components/CustomerFilters', () => ({
  default: () => <div data-testid="filters">Filters</div>,
}));
vi.mock('@modules/Customer/components/CustomerPlateList', () => ({
  default: () => <div data-testid="plate-list">PlateList</div>,
}));
vi.mock('@modules/Customer/components/CustomerPlateDetails', () => ({
  default: () => <div data-testid="plate-details">PlateDetails</div>,
}));

describe('CustomerPage', () => {
  const mockSetModule = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      setModule: mockSetModule,
    });
    (sdk.customers.plates.$use as any).mockReturnValue({
      data: null,
      isFetching: true,
      error: null,
    });
  });

  it('TC-FE-CP-01: rutea al módulo CUSTOMER y muestra estado de carga', () => {
    render(
      <MemoryRouter>
        <CustomerPage />
      </MemoryRouter>
    );

    expect(mockSetModule).toHaveBeenCalledWith('CUSTOMER');
    expect(screen.getByText(/Cargando catálogo/i)).toBeInTheDocument();
  });

  it('TC-FE-CP-02: renderiza componentes una vez cargado el catálogo', async () => {
    (sdk.customers.plates.$use as any).mockReturnValue({
      data: { data: [] },
      isFetching: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <CustomerPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('filters')).toBeInTheDocument();
      expect(screen.getByTestId('plate-list')).toBeInTheDocument();
      expect(screen.getByTestId('plate-details')).toBeInTheDocument();
    });
  });
});
