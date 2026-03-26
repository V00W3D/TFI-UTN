import type { Request } from 'express';
import { ERR, type InferSuccess } from '@app/sdk';
import type { MeContract } from '@app/contracts';

/**
 * @description Identity Extraction Logic.
 * Safely extracts the authenticated user context from the Express Request object.
 * No database query is performed here as the session is already hydrated by the middleware.
 */
export async function meService(req: Request): Promise<InferSuccess<typeof MeContract>> {
  if (!req.user) throw ERR.UNAUTHORIZED();
  return req.user as unknown as InferSuccess<typeof MeContract>;
}
