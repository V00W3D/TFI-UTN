import type { Request } from 'express';
import { ERR, type InferSuccess } from '@app/sdk';
import type { MeContract } from '@app/contracts';

/**
 * @description Identity Extraction Logic.
 * Returns a sanitized copy of the authenticated session already hydrated by middleware.
 */
export async function meService(req: Request): Promise<InferSuccess<typeof MeContract>> {
  if (!req.user) throw ERR.UNAUTHORIZED();

  return {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    phone: req.user.phone ?? null,
    role: req.user.role,
    profile: {
      ...(req.user.profile.tier ? { tier: req.user.profile.tier } : {}),
      ...(req.user.profile.post ? { post: req.user.profile.post } : {}),
      ...(req.user.profile.rank ? { rank: req.user.profile.rank } : {}),
    },
  };
}
