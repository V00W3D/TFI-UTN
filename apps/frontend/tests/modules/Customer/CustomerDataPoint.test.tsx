// @vitest-environment jsdom
/**
 * @file CustomerDataPoint.test.tsx
 * @module Customer/Tests
 * @description Unit tests for CustomerDataPoint component (No mocks version).
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CustomerDataPoint from '../../../src/modules/Customer/components/CustomerDataPoint';

// No mocks needed for this simple presentational component in JSDOM.
// Testing real rendering of icons and labels.

describe('CustomerDataPoint', () => {
  it('TC-FE-CDP-01: renderiza etiqueta y valor correctamente', () => {
    render(
      <CustomerDataPoint 
        label="Precio" 
        value="$10.00" 
      />
    );

    expect(screen.getByText(/Precio:/i)).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  it('TC-FE-CDP-02: renderiza el icono si se proporciona una clave', () => {
    const { container } = render(
      <CustomerDataPoint 
        icon="price" 
        value="100" 
      />
    );

    // Should find an SVG (PlateDataIcon renders as SVG)
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('TC-FE-CDP-03: prioriza iconNode sobre el icono por clave', () => {
    render(
      <CustomerDataPoint 
        icon="price" 
        iconNode={<span data-testid="custom-node">Custom</span>}
        value="100" 
      />
    );

    expect(screen.getByTestId('custom-node')).toBeInTheDocument();
    // In this case, PlateDataIcon shouldn't be rendered
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });
});
