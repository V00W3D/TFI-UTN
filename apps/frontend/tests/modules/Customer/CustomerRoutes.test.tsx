// @vitest-environment jsdom
/**
 * @file CustomerRoutes.test.tsx
 * @description Unit tests for CustomerRoutes configuration.
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { CustomerRoutes } from '../../../src/modules/Customer/CustomerRoutes';

// Mock component to avoid rendering the real page
vi.mock('@modules/Customer/pages/CustomerPage', () => ({
  default: () => <div data-testid="customer-page">Customer Page Mock</div>,
}));

describe('CustomerRoutes', () => {
  it('TC-FE-CROUTES-01: rutea al CustomerPage correctamente', () => {
    const router = createMemoryRouter([CustomerRoutes], {
      initialEntries: ['/customer'],
    });

    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('customer-page')).toBeInTheDocument();
  });
});
