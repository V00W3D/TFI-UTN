import { api } from '../../../tools/api';
import { meService } from '../services/MeService';

/**
 * @description Identity Probe Handler (GET /iam/me).
 * Returns the authenticated session shape already validated by middleware and contract.
 */
export const MeHandler = api.handler('GET /iam/me')(async (_input, ctx) => {
  return meService(ctx.req);
});
