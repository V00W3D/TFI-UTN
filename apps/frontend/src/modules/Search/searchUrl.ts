/**
 * @file searchUrl.ts
 * @module Search
 * @description Convierte el estado de filtros de busqueda en query string y viceversa.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-19
 * rnf: RNF-03
 *
 * @business
 * inputs: URLSearchParams y estado parcial de busqueda
 * outputs: payloads de filtros y query strings compactos
 * rules: omitir defaults; preservar arrays y numeros validos; aceptar solo sorts conocidos
 *
 * @technical
 * dependencies: @app/contracts
 * flow: parsea valores; normaliza tipos; mezcla defaults; serializa estado limpio
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 2
 * estimated_hours: 1
 *
 * @testing
 * cases: TC-SEARCH-01
 *
 * @notes
 * decisions: se usan helpers funcionales para mantener URLs cortas y predecibles
 */
import type { SearchPlatesQuery } from '@app/contracts';

const ARRAY_KEYS = new Set<keyof SearchPlatesQuery>([
  'recipeTypes',
  'flavors',
  'difficulties',
  'sizes',
  'excludeAllergens',
  'dietaryTags',
  'nutritionTags',
  'recipeDietaryTags',
  'tagNames',
]);

const NUMBER_KEYS = new Set<keyof SearchPlatesQuery>([
  'page',
  'pageSize',
  'minPrice',
  'maxPrice',
  'minCalories',
  'maxCalories',
  'minProtein',
  'maxProtein',
  'minFat',
  'maxFat',
  'minRating',
  'minRatingsCount',
  'minLikes',
  'maxPrepMinutes',
  'maxCookMinutes',
  'minYieldServings',
  'maxYieldServings',
  'minServedWeightGrams',
  'maxServedWeightGrams',
]);

const SORTS = new Set<string>([
  'price_asc',
  'price_desc',
  'rating_desc',
  'rating_asc',
  'name_asc',
  'name_desc',
  'popular_desc',
]);

export const DEFAULT_SEARCH: Pick<SearchPlatesQuery, 'sort' | 'page' | 'pageSize'> = {
  sort: 'name_asc',
  page: 1,
  pageSize: 24,
};

/** Lee query string del navegador → payload parcial (solo lo presente en la URL). */
export const parseSearchUrl = (sp: URLSearchParams): Partial<SearchPlatesQuery> => {
  const out: Partial<SearchPlatesQuery> = {};

  const setArr = (key: keyof SearchPlatesQuery, arr: string[]) => {
    (out as Record<string, unknown>)[key as string] = arr;
  };
  const setNum = (key: keyof SearchPlatesQuery, n: number) => {
    (out as Record<string, unknown>)[key as string] = n;
  };

  for (const key of ARRAY_KEYS) {
    const raw = sp.get(String(key));
    if (raw?.trim()) {
      const arr = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (arr.length) setArr(key, arr);
    }
  }

  for (const key of NUMBER_KEYS) {
    const raw = sp.get(String(key));
    if (raw == null || raw === '') continue;
    const n = Number(raw);
    if (Number.isFinite(n)) setNum(key, n);
  }

  const q = sp.get('q')?.trim();
  if (q) out.q = q;

  const sort = sp.get('sort');
  if (sort && SORTS.has(sort)) out.sort = sort as SearchPlatesQuery['sort'];

  return out;
};

export const mergeSearchPayload = (sp: URLSearchParams): SearchPlatesQuery => ({
  ...DEFAULT_SEARCH,
  ...parseSearchUrl(sp),
});

/** Serializa a query string (sin `?`). Omite valores por defecto para URLs cortas. */
export const stringifySearchUrl = (state: Partial<SearchPlatesQuery>): string => {
  const sp = new URLSearchParams();

  const put = (key: string, value: string) => {
    if (value !== '') sp.set(key, value);
  };

  if (state.q?.trim()) put('q', state.q.trim());

  if (state.sort && state.sort !== DEFAULT_SEARCH.sort) put('sort', state.sort);
  if (state.page != null && state.page !== DEFAULT_SEARCH.page) put('page', String(state.page));
  if (state.pageSize != null && state.pageSize !== DEFAULT_SEARCH.pageSize) {
    put('pageSize', String(state.pageSize));
  }

  for (const key of ARRAY_KEYS) {
    const v = state[key] as string[] | undefined;
    if (Array.isArray(v) && v.length) put(String(key), v.join(','));
  }

  for (const key of NUMBER_KEYS) {
    if (key === 'page' || key === 'pageSize') continue;
    const v = state[key] as number | undefined;
    if (typeof v === 'number' && Number.isFinite(v)) put(String(key), String(v));
  }

  return sp.toString();
};
