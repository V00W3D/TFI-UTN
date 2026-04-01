import { api } from '../../tools/api';
import { GetPlatesHandler } from './handlers/GetPlatesHandler';
import { GetFeaturedPlatesHandler } from './handlers/GetFeaturedPlatesHandler';
import { SearchPlatesHandler } from './handlers/SearchPlatesHandler';
import { UpsertReviewHandler } from './handlers/UpsertReviewHandler';

/**
 * @description CUSTOMERS Module Router.
 * Aggregates all customer-facing platform handlers (Catalog, Nutrition, Diets).
 */
export const CUSTOMERSRouter = api.router([
  GetFeaturedPlatesHandler,
  SearchPlatesHandler,
  GetPlatesHandler,
  UpsertReviewHandler,
]);
