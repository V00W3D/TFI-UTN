/**
 * @file sdk.test.ts
 * @module Frontend/Tests
 * @description Tests unitarios para el export del SDK en el frontend.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: variables de entorno (BACKEND_URL)
 * outputs: instancia Singleton de SDK y FormFactory
 * rules: centralizar la integración con la API y los formularios
 *
 * @technical
 * dependencies: vitest, sdk.ts
 * flow: importa sdk -> verifica existencia de miembros nucleo
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 0.5
 *
 * @testing
 * cases: TC-FE-SDK-01
 * ultima prueba exitosa: 2026-04-08 15:00:00
 *
 * @notes
 */
import { describe, expect, it, vi } from 'vitest';

// Minimal mock of env
vi.mock('../../src/qartEnv', () => ({
  BACKEND_URL: 'http://localhost:3000',
}));

// Mock @app/sdk to avoid real contract evaluation if needed
// but since we have them in the monorepo, let's see if it works without deep mocks first.

import { sdk, form } from '../../src/tools/sdk';

describe('Frontend SDK tool', () => {
  it('TC-FE-SDK-01: inicializa el sdk y la fabrica de formularios', () => {
    expect(sdk).toBeDefined();
    expect(form).toBeDefined();
    expect(sdk.$modules).toContain('iam');
    expect(sdk.$modules).toContain('customers');
  });

  it('TC-FE-SDK-02: el form factory tiene los modulos correctos', () => {
    expect(form.iam).toBeDefined();
    expect(form.customers).toBeDefined();
  });
});
