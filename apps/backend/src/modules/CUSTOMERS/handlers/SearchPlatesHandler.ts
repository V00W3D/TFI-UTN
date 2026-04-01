import type { SearchPlatesQuery } from '@app/contracts';
import { api } from '../../../tools/api';
import { searchPlatesService } from '../services/searchPlatesService';

export const SearchPlatesHandler = api.handler('GET /customers/search')(async (input) => {
  return searchPlatesService(input as SearchPlatesQuery);
});
