import { api } from '../../../tools/api';
import { getPlatesService } from '../services/GetPlatesService';

/**
 * @description Catalog Handler (GET /customers/plates).
 * Returns the full customer-facing restaurant catalog already shaped for the public contract.
 */
export const GetPlatesHandler = api.handler('GET /customers/plates')(async () => {
  return getPlatesService();
});
