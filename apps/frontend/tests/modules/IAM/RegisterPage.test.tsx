// @vitest-environment jsdom
/**
 * @file RegisterPage.test.tsx
 * @module Frontend/Tests/IAM
 * @description Unit tests for RegisterPage.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-01
 * rnf: RNF-03
 *
 * @business
 * inputs: registration data, store state
 * outputs: navigation, toast notifications, UI section changes
 * rules: redirects to login on successful registration; tracks active field for help context
 *
 * @technical
 * dependencies: vitest, @testing-library/react, RegisterPage, sdk, FormFactory
 * flow: mock dependencies -> render -> simulate interactions -> verify side effects
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-REGISTER-01, TC-FE-REGISTER-02
 * ultima prueba exitosa: 2026-04-08 15:00:00
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../../../src/modules/IAM/pages/RegisterPage';
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

// Mock SectionFactory to just render contents
vi.mock('../../../src/components/shared/SectionFactory', () => ({
  SectionFactory: ({ sections }: any) => (
    <div>
      {sections.map((s: any) => (
        <div key={s.key} data-testid={`section-${s.key}`}>
          {s.content}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    iam: {
      register: Object.assign(vi.fn(), {
        $use: vi.fn(),
        $reset: vi.fn(),
      }),
    },
  },
  form: {
    iam: {
      register: {
        fields: {
          name: ({ label }: any) => <div data-testid="field-name">{label}</div>,
          sname: () => null,
          lname: () => null,
          sex: () => null,
          username: () => null,
          email: () => null,
          phone: () => null,
          password: () => null,
          cpassword: () => null,
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

describe('RegisterPage', () => {
  const mockSetModule = vi.fn();
  const mockSuccessToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue({
      setModule: mockSetModule,
    });
    (useToastStore as any).mockReturnValue({
      success: mockSuccessToast,
    });
    (sdk.iam.register.$use as any).mockReturnValue({
      data: null,
      error: null,
      isFetching: false,
      isFormValid: true,
    });
  });

  it('TC-FE-REGISTER-01: rutea al login después de un registro exitoso', async () => {
    (sdk.iam.register.$use as any).mockReturnValue({
      data: { data: { id: 'usr-new' } },
      error: null,
      isFetching: false,
      isFormValid: true,
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(mockSuccessToast).toHaveBeenCalledWith(expect.stringContaining('CUENTA CREADA CON ÉXITO'));
    expect(mockNavigate).toHaveBeenCalledWith('/iam/login', { replace: true });
  });

  it('TC-FE-REGISTER-02: cambia el contexto de ayuda al enfocar campos', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Initial state
    expect(screen.getByText('TOCÁ UN CAMPO')).toBeInTheDocument();

    // Focus on name field container (which has the onFocusCapture in RegisterPage)
    const nameSection = screen.getByTestId('section-profile');
    const nameField = screen.getByTestId('field-name');
    
    // Simulate focus event bubbling up
    fireEvent.focus(nameField);

    expect(screen.getByText('NOMBRE')).toBeInTheDocument();
  });
});
