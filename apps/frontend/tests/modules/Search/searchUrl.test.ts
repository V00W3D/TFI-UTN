/**
 * @file searchUrl.test.ts
 * @module Search/Tests
 * @description Unit tests for searchUrl helpers — URL serialization and deserialization of search state.
 *
 * @tfi
 * section: IEEE 830 16
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: URLSearchParams, partial search state
 * outputs: deserialized query objects, serialized compact query strings
 * rules: omit defaults; preserve arrays and valid numbers; reject unknown sorts
 *
 * @technical
 * dependencies: vitest, searchUrl
 * flow: create URLSearchParams -> call parse/stringify helpers -> assert structure
 *
 * @estimation
 * complexity: Low
 * fpa: EQ
 * story_points: 1
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-SEARCH-URL-01 to TC-SEARCH-URL-03
 * ultima prueba exitosa: 2026-04-08 15:05:00
 *
 * @notes
 * decisions: focuses on boundary cases and default-omission behavior.
 */
import { describe, expect, it } from 'vitest';
import { parseSearchUrl, stringifySearchUrl, mergeSearchPayload, DEFAULT_SEARCH } from '../../src/modules/Search/searchUrl';

describe('searchUrl', () => {
  it('TC-SEARCH-URL-01: parseSearchUrl extrae arrays, números y query correctamente', () => {
    const sp = new URLSearchParams(
      'q=pizza&recipeTypes=MAIN,DESSERT&minPrice=5&minRating=4&sort=rating_desc'
    );
    const result = parseSearchUrl(sp);

    expect(result.q).toBe('pizza');
    expect(result.recipeTypes).toEqual(['MAIN', 'DESSERT']);
    expect(result.minPrice).toBe(5);
    expect(result.minRating).toBe(4);
    expect(result.sort).toBe('rating_desc');
  });

  it('TC-SEARCH-URL-02: parseSearchUrl ignora sorts inválidos y números NaN', () => {
    const sp = new URLSearchParams('sort=invalid_sort&minPrice=abc');
    const result = parseSearchUrl(sp);
    expect(result.sort).toBeUndefined();
    expect(result.minPrice).toBeUndefined();
  });

  it('TC-SEARCH-URL-03: stringifySearchUrl omite defaults y serializa correctamente', () => {
    // Default values — should be omitted
    const defaultState = { sort: DEFAULT_SEARCH.sort, page: DEFAULT_SEARCH.page, pageSize: DEFAULT_SEARCH.pageSize };
    expect(stringifySearchUrl(defaultState)).toBe('');

    // Non-default values
    const state = { sort: 'price_asc' as const, page: 3, pageSize: 12, q: 'burger', minRating: 4.5 };
    const qs = stringifySearchUrl(state);
    const parsed = new URLSearchParams(qs);
    expect(parsed.get('q')).toBe('burger');
    expect(parsed.get('sort')).toBe('price_asc');
    expect(parsed.get('page')).toBe('3');
    expect(parsed.get('pageSize')).toBe('12');
    expect(parsed.get('minRating')).toBe('4.5');
  });

  it('TC-SEARCH-URL-04: mergeSearchPayload rellena con defaults los campos faltantes', () => {
    const sp = new URLSearchParams('q=salad');
    const result = mergeSearchPayload(sp);
    expect(result.q).toBe('salad');
    expect(result.sort).toBe(DEFAULT_SEARCH.sort);
    expect(result.page).toBe(DEFAULT_SEARCH.page);
    expect(result.pageSize).toBe(DEFAULT_SEARCH.pageSize);
  });
});
