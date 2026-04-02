import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET } from '../env';
import type { UserRole, CustomerTier, StaffPost, AuthorityRank } from '@app/sdk';

interface TokenPayload {
  id: string;
  role: UserRole;
  username?: string;
  email?: string;
  phone?: string | null;
  profile?: { tier?: CustomerTier; post?: StaffPost; rank?: AuthorityRank };
}

/**
 * Lee CupCake/Cake sin rotar tokens; útil en rutas públicas para asociar usuario opcional.
 */
export const readOptionalUserId = (req: Request): string | null => {
  const { CupCake: access, Cake: refresh } = req.cookies || {};
  if (!access && !refresh) return null;
  try {
    if (access) {
      const p = jwt.verify(access, SESSION_SECRET) as TokenPayload;
      return p.id;
    }
    const p = jwt.verify(refresh!, REFRESH_SECRET) as TokenPayload;
    return p.id;
  } catch {
    return null;
  }
};
