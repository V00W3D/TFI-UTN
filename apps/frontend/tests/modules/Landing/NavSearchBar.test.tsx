// @vitest-environment jsdom
/**
 * @file NavSearchBar.test.tsx
 * @module Landing/Tests
 * @description Unit tests for NavSearchBar component (Mocking animations).
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: search query strings
 * outputs: navigable suggestions list
 * rules: debounce search (300ms); minimal 2 chars; navigate to /search on selection or enter
 *
 * @technical
 * dependencies: @testing-library/react, vitest, sdk, react-router-dom
 * flow: render -> type query -> wait for debounce -> mock sdk response -> click suggestion -> verify navigate
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1.5
 *
 * @testing
 * cases: TC-FE-NSB-01, TC-FE-NSB-02, TC-FE-NSB-03
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NavSearchBar from '../../../src/modules/Landing/components/NavSearchBar';
import { sdk } from '../../../src/tools/sdk';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock SDK
vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    customers: {
      search: Object.assign(vi.fn(), {
        $use: vi.fn(() => ({ data: null, isFetching: false })),
      }),
    },
  },
}));

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', () => ({
  motion: {
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('NavSearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('TC-FE-NSB-01: no busca con menos de 2 caracteres', async () => {
    render(
      <MemoryRouter>
        <NavSearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Buscar platos/i);
    fireEvent.change(input, { target: { value: 'a' } });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(sdk.customers.search).not.toHaveBeenCalled();
  });

  it('TC-FE-NSB-02: busca y muestra resultados con 2+ caracteres', async () => {
    const mockResults = {
      data: {
        data: {
          items: [
            { id: '1', name: 'Pizza Margherita', size: 'REGULAR', menuPrice: 1000 },
          ],
        },
      },
    };

    (sdk.customers.search.$use as any).mockReturnValue({
      data: mockResults.data,
      isFetching: false,
    });

    render(
      <MemoryRouter>
        <NavSearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Buscar platos/i);
    fireEvent.change(input, { target: { value: 'piz' } });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(sdk.customers.search).toHaveBeenCalledWith(expect.objectContaining({ q: 'piz' }));
    
    // Check if suggestion is visible
    expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
  });

  it('TC-FE-NSB-03: navega al buscador al seleccionar una sugerencia', async () => {
    const mockResults = {
      data: {
        data: {
          items: [
            { id: '1', name: 'Burger', size: 'REGULAR', menuPrice: 800 },
          ],
        },
      },
    };

    (sdk.customers.search.$use as any).mockReturnValue({
      data: mockResults.data,
      isFetching: false,
    });

    render(
      <MemoryRouter>
        <NavSearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Buscar platos/i);
    fireEvent.change(input, { target: { value: 'bur' } });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    // click via mousedown as per component implementation
    const suggestion = screen.getByText('Burger');
    fireEvent.mouseDown(suggestion);

    expect(mockNavigate).toHaveBeenCalledWith('/search?q=Burger');
  });

  it('TC-FE-NSB-04: cierra el dropdown con la tecla Escape', async () => {
    (sdk.customers.search.$use as any).mockReturnValue({
      data: { data: { items: [{ id: '1', name: 'Burger' }] } },
      isFetching: false,
    });

    render(
      <MemoryRouter>
        <NavSearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Buscar platos/i);
    fireEvent.change(input, { target: { value: 'bur' } });
    
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
