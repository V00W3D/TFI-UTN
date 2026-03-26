import { api } from '../../../tools/api';
import { getPlatesService } from '../services/GetPlatesService';

/**
 * @description Catalog Handler (GET /customers/plates).
 * Orchestrates fetching the QART nutritional plate catalog.
 */
export const GetPlatesHandler = api.handler('GET /customers/plates')(async (_input, _ctx) => {
  const plates = await getPlatesService();
  return plates;
});
