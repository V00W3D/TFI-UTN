// @vitest-environment jsdom
/**
 * @file ConfigSectionCredentials.test.tsx
 * @module Landing/Tests
 * @description Unit tests for ConfigSectionCredentials component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: user session from appStore, addresses from sdk
 * outputs: profile data view, security fields, address management
 * rules: show loading state when user is null; show user data when logged in; verified/pending badges
 *
 * @technical
 * dependencies: @testing-library/react, vitest, appStore, sdk, react-router-dom
 * flow: mock appStore + sdk -> render -> verify data display and state labels
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-FE-CSC-01, TC-FE-CSC-02, TC-FE-CSC-03
 *
 * @notes
 * decisions: component is 1151 lines with complex security/address flows;
 *   tests focus on the critical presentation states and the key edit triggers.
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/appStore', () => ({ useAppStore: vi.fn() }));
vi.mock('../../../src/toastStore', () => ({
  useToastStore: vi.fn(() => ({ error: vi.fn(), success: vi.fn(), warning: vi.fn() })),
}));
vi.mock('../../../src/tools/sdk', () => ({
  sdk: {
    customers: { addresses: vi.fn().mockResolvedValue({ data: [] }) },
    iam: {
      patchMe: vi.fn(),
      'request-token': vi.fn(),
      'verify-update': vi.fn(),
    },
  },
}));
vi.mock('../../../src/qartEnv', () => ({
  MODE: 'dev',
  BACKEND_URL: 'http://localhost:3000',
}));
vi.mock('../../../src/components/shared/SectionFactory', () => ({
  SectionFactory: ({ sections }: any) => (
    <div>{sections.map((s: any) => <div key={s.key}>{s.content}</div>)}</div>
  ),
}));
vi.mock('../../../src/components/shared/GlobalProfileCard', () => ({
  GlobalProfileCard: () => <div data-testid="global-profile-card" />,
}));
vi.mock('../../../src/components/shared/AppIcons', () => ({
  ArrowRightIcon: () => <span />,
  CopyIcon: () => <span />,
  EditIcon: () => <span />,
}));

import { ConfigSectionCredentials } from '../../../src/modules/Landing/components/ConfigSectionCredentials';
import { useAppStore } from '../../../src/appStore';

const mockUser: any = {
  id: 'u1',
  name: 'Juan',
  sname: null,
  lname: 'Perez',
  username: 'juanperez',
  sex: 'MALE',
  email: 'juan@example.com',
  emailVerified: true,
  phone: null,
  phoneVerified: false,
  role: 'CUSTOMER',
  profile: { tier: 'REGULAR' },
};

describe('ConfigSectionCredentials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-FE-CSC-01: muestra indicador de carga cuando no hay usuario', () => {
    (useAppStore as any).mockReturnValue({ user: null, setUser: vi.fn() });
    render(
      <MemoryRouter>
        <ConfigSectionCredentials />
      </MemoryRouter>
    );
    expect(screen.getByText(/Cargando datos/i)).toBeInTheDocument();
  });

  it('TC-FE-CSC-02: muestra los datos del perfil cuando el usuario esta logueado', () => {
    (useAppStore as any).mockReturnValue({ user: mockUser, setUser: vi.fn() });
    render(
      <MemoryRouter>
        <ConfigSectionCredentials />
      </MemoryRouter>
    );

    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Perez')).toBeInTheDocument();
    expect(screen.getByText('@juanperez')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
  });

  it('TC-FE-CSC-03: muestra badge Verificado para email verificado', () => {
    (useAppStore as any).mockReturnValue({ user: mockUser, setUser: vi.fn() });
    render(
      <MemoryRouter>
        <ConfigSectionCredentials />
      </MemoryRouter>
    );
    expect(screen.getByText('Verificado')).toBeInTheDocument();
  });

  it('TC-FE-CSC-04: muestra badge Pendiente para email no verificado', () => {
    const unverifiedUser = { ...mockUser, emailVerified: false };
    (useAppStore as any).mockReturnValue({ user: unverifiedUser, setUser: vi.fn() });
    render(
      <MemoryRouter>
        <ConfigSectionCredentials />
      </MemoryRouter>
    );
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('TC-FE-CSC-05: boton Editar en nombre abre el panel de edicion', () => {
    (useAppStore as any).mockReturnValue({ user: mockUser, setUser: vi.fn() });
    render(
      <MemoryRouter>
        <ConfigSectionCredentials />
      </MemoryRouter>
    );

    // Find the first Editar button (for name field)
    const editButtons = screen.getAllByText('Editar');
    fireEvent.click(editButtons[0]);

    // The edit panel shows an input field (the field editor)
    expect(screen.getByText('Editar dato')).toBeInTheDocument();
  });
});
