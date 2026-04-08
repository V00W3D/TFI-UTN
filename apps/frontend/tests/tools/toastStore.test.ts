/**
 * @file toastStore.test.ts
 * @module Frontend/Tests
 * @description Unit tests for toast notifications global store.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: toast messages, types and durations
 * outputs: array of active toasts, auto-removal triggers
 * rules: toasts automatically disappear after duration, correct types map properly
 *
 * @technical
 * dependencies: vitest, toastStore
 * flow: add toasts of various types -> verify state -> advance fake timers -> verify removal
 *
 * @estimation
 * complexity: Low
 * fpa: ILF
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-TOAST-STORE-01
 * ultima prueba exitosa: 2026-04-08 13:45:00
 *
 * @notes
 * decisions: focuses only on ensuring store initialization, mutations, and async timeout removal work correctly.
 */
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { useToastStore } from '../../src/toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('TC-TOAST-STORE-01: añade, categoriza y expira toasts correctamente', () => {
    const store = useToastStore.getState();
    expect(store.toasts).toHaveLength(0);

    // Helpers
    store.success('Operation done', 3000);
    store.error('Operation failed', 5000);
    store.warning('Careful', 0); // No expire
    
    let currentToasts = useToastStore.getState().toasts;
    expect(currentToasts).toHaveLength(3);
    
    const [t1, t2, t3] = currentToasts;
    expect(t1.type).toBe('success');
    expect(t2.type).toBe('error');
    expect(t3.type).toBe('warning');

    // Adelantar 3 segundos -> desaparece el primero
    vi.advanceTimersByTime(3000);
    currentToasts = useToastStore.getState().toasts;
    expect(currentToasts).toHaveLength(2);
    expect(currentToasts.find(t => t.id === t1.id)).toBeUndefined();

    // Adelantar 2 segundos más -> desaparece el segundo
    vi.advanceTimersByTime(2000);
    currentToasts = useToastStore.getState().toasts;
    expect(currentToasts).toHaveLength(1);
    expect(currentToasts[0].id).toBe(t3.id); // Solo queda el de `duration 0`

    // Remove explicitly
    useToastStore.getState().removeToast(t3.id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
