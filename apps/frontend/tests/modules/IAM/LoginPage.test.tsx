// @vitest-environment jsdom
/**
 * @file LoginPage.test.tsx
 * @module Frontend/Tests/IAM
 * @description Unit tests for LoginPage.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-02
 * rnf: RNF-02
 *
 * @business
 * inputs: user credentials, store state
 * outputs: navigation, toast notifications, store state updates
 * rules: redirects to home on success; shows error alert on failure
 *
 * @technical
 * dependencies: vitest, @testing-library/react, LoginPage, appStore, sdk
 * flow: mock dependencies -> render -> simulate success/error states -> verify effects
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-LOGIN-01, TC-FE-LOGIN-02
 * ultima prueba exitosa: 2026-04-08 15:00:00
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../../src/modules/IAM/pages/LoginPage';
import { useAppStore } from '../../../src/appStore';
import { useToastStore } from '../../../src/toastStore';
import { sdk, form } from '../../../src/tools/sdk';

// --- MOCKS ---

vi.mock('../../../src/appStore', () => ({
  useAppStore: vi.fn(),
}));

vi.mock('../../../src/toastStore', () => ({
  useToastStore: vi.fn(),
}));

vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    iam: {
      login: {
        $use: vi.fn(),
        $reset: vi.fn(),
      },
    },
  },
  form: {
    iam: {
      login: {
        fields: {
          identity: ({ label }: any) => <div>{label}</div>,
          password: ({ label }: any) => <div>{label}</div>,
        },
        submit: vi.fn((cb) => (e: any) => { e.preventDefault(); return cb({}); }),
        $form: {
          getState: () => ({ reset: vi.fn() }),
        },
      },
    },
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Link: ({ children, to }: any) => <a href={to}>{children}</a>,
    };
});

describe('LoginPage', () => {
  const mockSetModule = vi.fn();
  const mockSetUser = vi.fn();
  const mockSuccessToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      setModule: mockSetModule,
      setUser: mockSetUser,
    });
    (useToastStore as any).mockReturnValue({
      success: mockSuccessToast,
    });
    (sdk.iam.login.$use as any).mockReturnValue({
      data: null,
      error: null,
      isFetching: false,
      isFormValid: true,
    });
  });

  it('TC-FE-LOGIN-01: rutea correctamente después de un login exitoso', async () => {
    // Simulate successful login response
    (sdk.iam.login.$use as any).mockReturnValue({
      data: { data: { id: 'usr-1', name: 'Victor' } },
      error: null,
      isFetching: false,
      isFormValid: true,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Verify it updates store and notifies
    expect(mockSetUser).toHaveBeenCalledWith({ id: 'usr-1', name: 'Victor' });
    expect(mockSuccessToast).toHaveBeenCalledWith(expect.stringContaining('HOLA DE VUESTA, VICTOR'));
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('TC-FE-LOGIN-02: muestra error si falla la autenticación', () => {
    (sdk.iam.login.$use as any).mockReturnValue({
      data: null,
      error: { code: 'UNAUTHORIZED' },
      isFetching: false,
      isFormValid: true,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('NO PUDIMOS INICIAR SESIÓN')).toBeInTheDocument();
    expect(screen.getByText(/LOS DATOS INGRESADOS NO COINCIDEN/i)).toBeInTheDocument();
  });
});
