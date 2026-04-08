// @vitest-environment jsdom
/**
 * @file QRLogin.test.tsx
 * @description Unit tests for QRLogin component (Final Fix).
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { QRLogin } from '../../../src/modules/IAM/components/QRLogin';

// Mock crypto for JSDOM
if (!global.crypto) {
  (global as any).crypto = {
    randomUUID: () => 'test-uuid',
  };
}

describe('QRLogin', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('TC-FE-QR-01: muestra estados de carga y QR listo', async () => {
    render(<QRLogin />);

    // Initially loading
    expect(document.querySelector('.qrl-spinner')).toBeInTheDocument();

    // Advance for the simulated generate() delay
    await act(async () => {
      vi.advanceTimersByTime(601);
    });

    // We use a small interval here to let microtasks flush
    await act(async () => {
        vi.advanceTimersByTime(100);
    });

    expect(screen.getByText('2:00')).toBeInTheDocument();
  });

  it('TC-FE-QR-02: el código expira', async () => {
    render(<QRLogin />);

    // Ready
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('2:00')).toBeInTheDocument();

    // Expire (120s)
    await act(async () => {
      vi.advanceTimersByTime(125_000);
    });

    expect(screen.getByText(/Código expirado/i)).toBeInTheDocument();
    
    const refreshBtn = screen.getByText(/Generar nuevo código/i);
    await act(async () => {
        fireEvent.click(refreshBtn);
    });

    expect(document.querySelector('.qrl-spinner')).toBeInTheDocument();
  });
});
