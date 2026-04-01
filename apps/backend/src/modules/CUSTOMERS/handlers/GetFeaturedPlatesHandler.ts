import { api } from '../../../tools/api';
import { getFeaturedPlatesService } from '../services/getFeaturedPlatesService';

export const GetFeaturedPlatesHandler = api.handler('GET /customers/featured')(async (input) => {
  return getFeaturedPlatesService(input as { limit: number });
});
