// @vitest-environment jsdom
/**
 * @file ConfigSectionVisual.test.tsx
 * @module Landing/Tests
 * @description Unit tests for ConfigSectionVisual component.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: simpleMode state from appStore
 * outputs: toggle button, activated/deactivated label
 * rules: toggle button must call setSimpleMode with the inverted value
 *
 * @technical
 * dependencies: @testing-library/react, vitest, appStore
 * flow: mock appStore -> render -> verify toggle label -> click toggle -> verify call
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-FE-CSV-01, TC-FE-CSV-02
 *
 * @notes
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../../../src/appStore', () => ({ useAppStore: vi.fn() }));
// SectionFactory is a pass-through layout — allow it to render real, but mock its deps if needed
vi.mock('../../../src/components/shared/SectionFactory', () => ({
  SectionFactory: ({ sections }: any) => (
    <div>{sections.map((s: any) => <div key={s.key}>{s.content}</div>)}</div>
  ),
}));

import { ConfigSectionVisual } from '../../../src/modules/Landing/components/ConfigSectionVisual';
import { useAppStore } from '../../../src/appStore';

describe('ConfigSectionVisual', () => {
  const mockSetSimpleMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-FE-CSV-01: muestra el toggle en estado Desactivado cuando simpleMode es false', () => {
    (useAppStore as any).mockReturnValue({ simpleMode: false, setSimpleMode: mockSetSimpleMode });
    render(<ConfigSectionVisual />);

    expect(screen.getByText('Activar modo simple')).toBeInTheDocument();
    expect(screen.getByText('Desactivado')).toBeInTheDocument();
  });

  it('TC-FE-CSV-02: muestra el toggle en estado Activado cuando simpleMode es true', () => {
    (useAppStore as any).mockReturnValue({ simpleMode: true, setSimpleMode: mockSetSimpleMode });
    render(<ConfigSectionVisual />);

    expect(screen.getByText('Activado')).toBeInTheDocument();
  });

  it('TC-FE-CSV-03: click en el toggle llama a setSimpleMode con el valor invertido', () => {
    (useAppStore as any).mockReturnValue({ simpleMode: false, setSimpleMode: mockSetSimpleMode });
    render(<ConfigSectionVisual />);

    const toggleBtn = screen.getByRole('button');
    fireEvent.click(toggleBtn);

    expect(mockSetSimpleMode).toHaveBeenCalledWith(true);
  });
});
