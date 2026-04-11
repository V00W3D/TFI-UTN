import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock routing for App.tsx
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
  useRoutes: () => <div data-testid="app-routes" />,
}));
vi.mock('../src/AppRoutes', () => ({
  default: () => <div data-testid="app-routes" />,
}));
vi.mock('../src/components/shared/ToastProvider', () => ({
  default: () => <div data-testid="toast-provider" />,
}));

import App from '../src/App';

describe('App', () => {
  it('se renderiza la estructura principal de la applicacion', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });
});
