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

    // 1. Mock Customer
    const mockCustomer: AppUser = {
      id: 'c1',
      username: 'customer1',
      name: 'John',
      sname: null,
      lname: 'Doe',
      sex: 'MALE',
      email: 'john@doe.com',
      emailVerified: true,
      phone: null,
      phoneVerified: false,
      role: 'CUSTOMER',
      profile: { tier: 'VIP' }
    };
    store.setUser(mockCustomer);
    expect(useAppStore.getState().user).toEqual(mockCustomer);

    // 2. Mock Staff
    const mockStaff: AppUser = {
      id: 's1',
      username: 'staff1',
      name: 'Jane',
      sname: null,
      lname: 'Smith',
      sex: 'FEMALE',
      email: 'jane@qart.com',
      emailVerified: true,
      phone: '123456',
      phoneVerified: true,
      role: 'STAFF',
      profile: { post: 'WAITRESS' as any } // WAITER in lowercase or WAITRESS if specific, checking Enum
    };
    // Correcting ENUM based on user prompt: COOK, CASHIER, WAITER, BARISTA, CLEANER, DELIVERY
    mockStaff.profile.post = 'WAITER';
    store.setUser(mockStaff);
    expect(useAppStore.getState().user?.role).toBe('STAFF');
    expect(useAppStore.getState().user?.profile.post).toBe('WAITER');

    // 3. Mock Authority
    const mockAuth: AppUser = {
      id: 'a1',
      username: 'boss1',
      name: 'Big',
      sname: null,
      lname: 'Boss',
      sex: 'OTHER',
      email: 'boss@qart.com',
      emailVerified: true,
      phone: null,
      phoneVerified: false,
      role: 'AUTHORITY',
      profile: { rank: 'OWNER' }
    };
    store.setUser(mockAuth);
    expect(useAppStore.getState().user?.role).toBe('AUTHORITY');
    expect(useAppStore.getState().user?.profile.rank).toBe('OWNER');

    store.setSimpleMode(true);
    expect(useAppStore.getState().simpleMode).toBe(true);
  });
});
