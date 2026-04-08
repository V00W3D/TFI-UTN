// @vitest-environment jsdom
/**
 * @file NavProfile.test.tsx
 * @module Landing/Tests
 * @description Unit tests for NavProfile component (Fixing case sensitivity).
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-05
 * rnf: RNF-03
 *
 * @business
 * inputs: authenticated user state from store
 * outputs: profile preview and logout option
 * rules: show first char of username; allow copying ID; trigger logout flow
 *
 * @technical
 * dependencies: @testing-library/react, vitest, appStore, sdk, react-router-dom
 * flow: mock store -> render -> verify info -> click logout -> verify SDK call & navigate
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-NP-01, TC-FE-NP-02, TC-FE-NP-03
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NavProfile from '../../../src/modules/Landing/components/NavProfile';
import { useAppStore } from '../../../src/appStore';
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

// Mock appStore
vi.mock('../../../src/appStore', () => ({
  useAppStore: vi.fn(),
}));

// Mock SDK
vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    iam: {
      logout: vi.fn(() => Promise.resolve()),
    },
  },
}));

// Mock Clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('NavProfile', () => {
  const mockSetUser = vi.fn();
  const mockUser = {
    id: '12345678-1234-1234-1234-123456781234',
    username: 'testadmin',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      user: mockUser,
      setUser: mockSetUser,
    });
  });

  it('TC-FE-NP-01: renderiza información del usuario correctamente', () => {
    render(
      <MemoryRouter>
        <NavProfile />
      </MemoryRouter>
    );

    expect(screen.getByText('testadmin')).toBeInTheDocument();
    expect(screen.getByText('ID: 123456...')).toBeInTheDocument();
    // JSDOM uses raw text nodes, CSS 'uppercase' isn't applied to .getByText
    expect(screen.getByText('t')).toBeInTheDocument(); 
  });

  it('TC-FE-NP-02: permite copiar el ID al portapapeles', async () => {
    render(
      <MemoryRouter>
        <NavProfile />
      </MemoryRouter>
    );

    const copyBtn = screen.getByTitle(/Copiar ID/i);
    await fireEvent.click(copyBtn);

    expect(mockWriteText).toHaveBeenCalledWith(mockUser.id);
  });

  it('TC-FE-NP-03: ejecuta el flujo de logout correctamente', async () => {
    render(
      <MemoryRouter>
        <NavProfile />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByTitle(/Cerrar sesión/i);
    await fireEvent.click(logoutBtn);

    expect(sdk.iam.logout).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('/iam/login');
  });

  it('TC-FE-NP-04: no renderiza nada si no hay usuario', () => {
    (useAppStore as any).mockReturnValue({ user: null });
    const { container } = render(
      <MemoryRouter>
        <NavProfile />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});
