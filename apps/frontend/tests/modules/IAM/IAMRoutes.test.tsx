// @vitest-environment jsdom
/**
 * @file IAMRoutes.test.tsx
 * @description Unit tests for IAMRoutes configuration.
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom';
import { IAMRoutes } from '../../../src/modules/IAM/IAMRoutes';

// Mock components to avoid deep rendering complexity
vi.mock('../../../src/modules/IAM/layouts/AuthLayout', () => ({
  default: () => <div data-testid="auth-layout"><Outlet /></div>,
}));

vi.mock('../../../src/modules/IAM/pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login</div>,
}));

vi.mock('../../../src/modules/IAM/pages/RegisterPage', () => ({
  default: () => <div data-testid="register-page">Register</div>,
}));

describe('IAMRoutes', () => {
  it('TC-FE-ROUTES-01: rutea a login correctamente', () => {
    const router = createMemoryRouter([IAMRoutes], {
      initialEntries: ['/iam/login'],
    });

    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('TC-FE-ROUTES-02: rutea a register correctamente', () => {
    const router = createMemoryRouter([IAMRoutes], {
      initialEntries: ['/iam/register'],
    });

    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });
});
