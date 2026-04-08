// @vitest-environment jsdom
/**
 * @file FormFactory.test.tsx
 * @module Frontend/Tests
 * @description Tests unitarios para la fábrica de formularios reactivos.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-01, RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: SDK mockeado, interacciones del usuario en campos generados
 * outputs: renderizado de DOM, llamadas a navegación y ejecución de callbacks
 * rules: el factory debe vincular correctamente campos al store de Zustand del SDK
 *
 * @technical
 * dependencies: vitest, @testing-library/react, FormFactory, zustand
 * flow: mockea SDK -> instancia factory -> renderiza campo -> simula cambio -> verifica store
 *
 * @estimation
 * complexity: High
 * fpa: EQ
 * story_points: 5
 * estimated_hours: 3
 *
 * @testing
 * cases: TC-FF-01, TC-FF-02, TC-FF-03
 * ultima prueba exitosa: 2026-04-08 15:00:00
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { create } from 'zustand';
import { FormFactory } from '../../src/tools/FormFactory';
import { MemoryRouter } from 'react-router-dom';

// --- MOCKS ---

// Mocking PhoneInput to avoid 3rd party complexity in jsdom
vi.mock('react-phone-number-input', () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="phone-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mocking useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('FormFactory', () => {
  // Create a minimal mock SDK
  const mockStore = create(() => ({
    values: { name: '' },
    errors: {},
    isFormValid: true,
    set: vi.fn((name: string, val: any) => {
        // We'll manually update the mock store in some tests if needed, 
        // but usually we just want to see if 'set' was called.
    }),
    blur: vi.fn(),
    validate: vi.fn().mockResolvedValue(true),
    getValues: () => ({ name: 'test' }),
  }));

  const mockEndpoint = vi.fn().mockResolvedValue({ success: true });
  (mockEndpoint as any).$form = mockStore;
  (mockEndpoint as any).$use = () => ({
    data: null,
    error: null,
    isFetching: false,
    isFormValid: true,
  });
  (mockEndpoint as any).$reset = vi.fn();

  const mockSdk = {
    $modules: ['iam'],
    iam: {
      register: mockEndpoint,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.setState({ values: { name: '' }, errors: {} });
  });

  it('TC-FF-01: instancia el factory y genera campos vinculados', async () => {
    const user = userEvent.setup();
    const factory = FormFactory(mockSdk);
    const { name: NameField } = factory.iam.register.fields;

    render(<NameField label="Nombre" placeholder="Ingresa tu nombre" />);

    const input = screen.getByPlaceholderText('Ingresa tu nombre');
    expect(input).toBeInTheDocument();

    await user.type(input, 'Victor');
    
    // Verify it called store.set
    expect(mockStore.getState().set).toHaveBeenCalledWith('name', 'V');
  });

  it('TC-FF-02: el componente Form delega correctamente el submit', async () => {
    const factory = FormFactory(mockSdk);
    const { Form, fields } = factory.iam.register;

    render(
      <MemoryRouter>
        <Form buttonText="Enviar Datos">
          <fields.name label="Nombre" />
        </Form>
      </MemoryRouter>
    );

    const submitBtn = screen.getByText('Enviar Datos');
    await fireEvent.click(submitBtn);

    // Should call validate on the store
    expect(mockStore.getState().validate).toHaveBeenCalled();
  });

  it('TC-FF-03: maneja complementos visuales (password toggle)', async () => {
    const user = userEvent.setup();
    const factory = FormFactory(mockSdk);
    const { name: PasswordField } = factory.iam.register.fields;

    render(
      <PasswordField 
        label="Password" 
        control="password" 
        addons={[{ type: 'passwordToggle' }]} 
      />
    );

    const input = screen.getByLabelText(/password/i) as HTMLInputElement;
    expect(input.type).toBe('password');

    const toggleBtn = screen.getByLabelText(/mostrar contraseña/i);
    await user.click(toggleBtn);

    expect(input.type).toBe('text');
  });
});
