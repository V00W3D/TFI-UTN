// @vitest-environment jsdom
/**
 * @file AuthLayout.test.tsx
 * @description Unit tests for AuthLayout component.
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from '../../../src/modules/IAM/layouts/AuthLayout';

describe('AuthLayout', () => {
  it('TC-FE-LAYOUT-01: renderiza los links de navegación y el outlet', () => {
    render(
      <MemoryRouter initialEntries={['/iam/login']}>
        <Routes>
          <Route path="/iam" element={<AuthLayout />}>
            <Route path="login" element={<div data-testid="child">Login Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Verify NavLinks
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/crear cuenta/i)).toBeInTheDocument();

    // Verify Outlet
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Login Content')).toBeInTheDocument();
  });

  it('TC-FE-LAYOUT-02: aplica clases de activo correctamente', () => {
    render(
      <MemoryRouter initialEntries={['/iam/login']}>
        <Routes>
          <Route path="/iam" element={<AuthLayout />}>
            <Route path="login" element={<div>content</div>} />
            <Route path="register" element={<div>content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const loginLink = screen.getByText(/iniciar sesión/i);
    expect(loginLink).toHaveClass('auth-link-active');
  });
});
