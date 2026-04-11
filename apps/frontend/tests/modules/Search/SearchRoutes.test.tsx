import { describe, expect, it } from 'vitest';
import { SearchRoutes } from '../../src/modules/Search/SearchRoutes';

describe('SearchRoutes', () => {
  it('se expone el objeto de rutas base del sub-modulo Search', () => {
    expect(SearchRoutes).toHaveProperty('path', '/search');
    expect(SearchRoutes).toHaveProperty('element');
  });
});
