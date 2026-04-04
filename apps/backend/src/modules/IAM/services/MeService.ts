import type { Request } from 'express';
import { ERR, type InferSuccess } from '@app/sdk';
import type { MeContract } from '@app/contracts';

/**
 * @description Identity Extraction Logic.
 * Returns a sanitized copy of the authenticated session already hydrated by middleware.
 */
export async function meService(req: Request): Promise<InferSuccess<typeof MeContract>> {
  if (!req.user) throw ERR.UNAUTHORIZED();

  const user = req.user;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    sname: user.sname,
    lname: user.lname,
    sex: user.sex,
    email: user.email,
    emailVerified: user.emailVerified,
    phone: user.phone,
    phoneVerified: user.phoneVerified,
    role: user.role,
    profile: {
      ...(user.profile.tier ? { tier: user.profile.tier } : {}),
      ...(user.profile.post ? { post: user.profile.post } : {}),
      ...(user.profile.rank ? { rank: user.profile.rank } : {}),
    },
  };
}
