import { describe, expect, it } from 'vitest';
import { PUBLIC_APP_SCOPE, SDK_API_URL } from '../../src/qartEnv';

describe('qartEnv', () => {
  it('expone las variables de entorno correctamente configuradas', () => {
    expect(typeof PUBLIC_APP_SCOPE).toBe('string');
    expect(typeof SDK_API_URL).toBe('string');
  });
});
