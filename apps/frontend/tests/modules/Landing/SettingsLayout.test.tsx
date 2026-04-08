// @vitest-environment jsdom
/**
 * @file SettingsLayout.test.tsx
 * @module Frontend/Tests/Landing
 * @description Tests unitarios para el componente SettingsLayout.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-09, RF-10
 * rnf: RNF-03
 *
 * @business
 * inputs: tabs config, activeTab, labels, callbacks
 * outputs: renderizado de navegación y contenido de pestañas
 * rules: clicking tab calls onTabChange; renders correct component for activeTab
 *
 * @technical
 * dependencies: vitest, @testing-library/react, SettingsLayout
 * flow: renderiza con tabs mocked; simula clicks; verifica callbacks y cambios en el DOM
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-SETTINGS-LAYOUT-01
 * ultima prueba exitosa: 2026-04-08 12:08:24
 *
 * @notes
 * decisions: se movió de src/ a tests/ para estandarización arquitectónica
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SettingsLayout } from '../../../src/modules/Landing/components/settings/SettingsLayout';

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: import('react').ReactNode }) => children,
  motion: {
    div: ({ children, ...props }: Record<string, any>) => <div {...props}>{children}</div>,
  },
}));

describe('SettingsLayout', () => {
  it('muestra la pestana activa y permite cambiar de contenido', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    const { rerender } = render(
      <SettingsLayout
        title="Ajustes"
        subtitle="Cuenta y apariencia"
        moduleLabel="USUARIO"
        versionLabel="TEST_V1"
        activeTab="account"
        onTabChange={onTabChange}
        tabs={[
          {
            id: 'account',
            label: 'Cuenta',
            shortLabel: 'Cuenta',
            description: 'Datos personales',
            status: 'Cuenta activa',
            component: <div>Contenido cuenta</div>,
          },
          {
            id: 'appearance',
            label: 'Apariencia',
            shortLabel: 'Apariencia',
            description: 'Tema visual',
            status: 'Tema actual',
            component: <div>Contenido apariencia</div>,
          },
        ]}
      />,
    );

    expect(screen.getByText('Contenido cuenta')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /apariencia/i }));
    expect(onTabChange).toHaveBeenCalledWith('appearance');

    rerender(
      <SettingsLayout
        title="Ajustes"
        subtitle="Cuenta y apariencia"
        moduleLabel="USUARIO"
        versionLabel="TEST_V1"
        activeTab="appearance"
        onTabChange={onTabChange}
        tabs={[
          {
            id: 'account',
            label: 'Cuenta',
            shortLabel: 'Cuenta',
            description: 'Datos personales',
            status: 'Cuenta activa',
            component: <div>Contenido cuenta</div>,
          },
          {
            id: 'appearance',
            label: 'Apariencia',
            shortLabel: 'Apariencia',
            description: 'Tema visual',
            status: 'Tema actual',
            component: <div>Contenido apariencia</div>,
          },
        ]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Contenido apariencia')).toBeInTheDocument();
      expect(screen.queryByText('Contenido cuenta')).not.toBeInTheDocument();
    });
  });
});
