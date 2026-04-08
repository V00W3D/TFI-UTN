// @vitest-environment jsdom
/**
 * @file Navbar.test.tsx
 * @module Landing/Tests
 * @description Unit tests for primary Navbar component (Mocking env).
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: global auth state from store
 * outputs: responsive navigation bars, search access, and profile controls
 * rules: show auth buttons for guests; show profile for users; show alert dot for unverified users
 *
 * @technical
 * dependencies: @testing-library/react, vitest, appStore, react-router-dom, framer-motion
 * flow: mock store -> render -> verify presence of links -> verify auth state elements
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1.5
 *
 * @testing
 * cases: TC-FE-NB-01, TC-FE-NB-02, TC-FE-NB-03
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// 1. Mock env BEFORE imports that might use it (like sdk)
vi.mock('../../../src/qartEnv', () => ({
  MODE: 'dev',
  PUBLIC_APP_SCOPE: 'full',
  BACKEND_URL: 'http://localhost:3000',
}));

// Now import Navbar
import Navbar from '../../../src/modules/Landing/components/Navbar';
import { useAppStore } from '../../../src/appStore';

// Mock child components to keep tests focused on Navbar logic
vi.mock('./NavSearchBar', () => ({
  default: () => <div data-testid="nav-search-bar" />
}));
vi.mock('./NavProfile', () => ({
  default: () => <div data-testid="nav-profile" />
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    // Keep Link as actual
    Link: actual.Link,
  };
});

// Mock appStore
vi.mock('../../../src/appStore', () => ({
  useAppStore: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-FE-NB-01: muestra botones de auth para invitados', () => {
    (useAppStore as any).mockReturnValue({ user: null });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Ingresá/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrate/i)).toBeInTheDocument();
    expect(screen.queryByTestId('nav-profile')).not.toBeInTheDocument();
  });

  it('TC-FE-NB-02: muestra el perfil para usuarios autenticados', () => {
    (useAppStore as any).mockReturnValue({ 
      user: { id: '1', username: 'testuser', emailVerified: true, phoneVerified: true } 
    });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('nav-profile')).toBeInTheDocument();
    expect(screen.queryByText(/Ingresá/i)).not.toBeInTheDocument();
  });

  it('TC-FE-NB-03: muestra el indicador de alerta para cuentas no verificadas', () => {
    (useAppStore as any).mockReturnValue({ 
      user: { id: '1', username: 'testuser', emailVerified: false, phoneVerified: true } 
    });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // The unverified alert dot is in the "Ajustes" link
    const configLink = screen.getByTitle(/Ajustes/i);
    expect(configLink.querySelector('.bg-qart-error')).toBeInTheDocument();
  });

  it('TC-FE-NB-04: navega al inicio cuando se clickea el logo', () => {
    (useAppStore as any).mockReturnValue({ user: null });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logo = screen.getByLabelText(/Ir al inicio/i);
    fireEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('TC-FE-NB-05: incluye todos los links de la sección landing', () => {
    (useAppStore as any).mockReturnValue({ user: null });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Cómo funciona')).toHaveAttribute('href', '/#como-funciona');
    expect(screen.getByText('Locales')).toHaveAttribute('href', '/#locales');
    expect(screen.getByText('Destacados')).toHaveAttribute('href', '/#destacados');
    expect(screen.getByText('Contacto')).toHaveAttribute('href', '/#contact');
  });
});
