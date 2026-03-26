import { api } from '../../tools/api';
import { GetPlatesHandler } from './handlers/GetPlatesHandler';

/**
 * @description CUSTOMERS Module Router.
 * Aggregates all customer-facing platform handlers (Catalog, Nutrition, Diets).
 */
export const CUSTOMERSRouter = api.router([GetPlatesHandler]);
