import { api } from '../../../tools/api';
import { meService } from '../services/MeService';

/**
 * @description Identity Probe Handler (GET /iam/me).
 * Returns the profile of the currently authenticated subject.
 * Relies on authMiddleware having already populated req.user.
 */
export const MeHandler = api.handler('GET /iam/me')(async (_input, ctx) => meService(ctx.req));
