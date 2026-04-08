/**
 * @file appStore.test.ts
 * @module Frontend/Tests
 * @description Unit tests for global application state store (Zustand).
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: mode, module, user, simpleMode
 * outputs: new state stored in memory and persisted storage
 * rules: module should not persist, mode/user/simpleMode should persist
 *
 * @technical
 * dependencies: vitest, appStore
 * flow: fetch store, verify default states, mutate fields, verify new state
 *
 * @estimation
 * complexity: Low
 * fpa: ILF
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-APP-STORE-01
 * ultima prueba exitosa: 2026-04-08 13:40:00
 *
 * @notes
 * decisions: focuses only on ensuring store initialization and mutations work correctly.
 */
import { describe, expect, it, beforeEach } from 'vitest';
import { useAppStore } from '../../src/appStore';
import type { AppUser } from '../../src/appStore';

describe('appStore', () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useAppStore.setState({
      mode: 'light',
      module: 'CORE',
      user: null,
      simpleMode: false,
    });
  });

  it('TC-APP-STORE-01: 초기 valores y mutations funcionan correctamente', () => {
    const store = useAppStore.getState();

    // Defaults
    expect(store.mode).toBe('light');
    expect(store.module).toBe('CORE');
    expect(store.user).toBeNull();
    expect(store.simpleMode).toBe(false);

    // Mutations
    store.setMode('dark');
    expect(useAppStore.getState().mode).toBe('dark');

    store.setModule('POS');
    expect(useAppStore.getState().module).toBe('POS');

    const mockUser: AppUser = {
      id: 'usr1',
      identity: 'test',
      active: true,
      role: 'STAFF',
      verified: true
    };
    store.setUser(mockUser);
    expect(useAppStore.getState().user).toEqual(mockUser);

    store.setSimpleMode(true);
    expect(useAppStore.getState().simpleMode).toBe(true);
  });
});
