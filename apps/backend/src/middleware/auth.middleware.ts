import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SESSION_SECRET, REFRESH_SECRET, BUN_MODE } from '../env';
import {
  ERR,
  type UserRole,
  type CustomerTier,
  type StaffPost,
  type AuthorityRank,
} from '@app/sdk';

/** @description Compact JWT payload representing the identity of the authenticated subject. */
interface TokenPayload {
  id: string;
  role: UserRole;
  username?: string;
  email?: string;
  phone?: string | null;
  profile?: { tier?: CustomerTier; post?: StaffPost; rank?: AuthorityRank };
  iat?: number;
  exp?: number;
}

/** @description Re-usable cookie configuration parameters. */
const COOKIE_BASE = { httpOnly: true, secure: BUN_MODE === 'prod', sameSite: 'strict' as const };

/** @description Maps a verified JWT payload to the Express Request object's user property. */
const mapUser = (req: Request, p: TokenPayload) =>
  (req.user = {
    id: p.id,
    role: p.role,
    username: p.username ?? '',
    email: p.email ?? '',
    phone: p.phone ?? null,
    profile: p.profile ?? {},
  });

/**
 * @description Core Authentication Middleware.
 * Implements a dual-token rotation strategy (CupCake/Cake) to balance security and UX.
 * 1. Verifies 'CupCake' (Access Token).
 * 2. Falls back to 'Cake' (Refresh Token) if CupCake is missing or expired.
 * 3. Auto-rotates a new CupCake session on successful Cake validation.
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { CupCake: access, Cake: refresh } = req.cookies || {};
  if (!access && !refresh) return next(ERR.UNAUTHORIZED());
  try {
    if (access) {
      mapUser(req, jwt.verify(access, SESSION_SECRET) as TokenPayload);
      return next();
    }
    const decoded = jwt.verify(refresh!, REFRESH_SECRET) as TokenPayload;
    res.cookie(
      'CupCake',
      jwt.sign(
        {
          id: decoded.id,
          role: decoded.role,
          username: decoded.username,
          email: decoded.email,
          phone: decoded.phone,
          profile: decoded.profile,
        },
        SESSION_SECRET,
        { expiresIn: '1h' },
      ),
      { ...COOKIE_BASE, maxAge: 3600000 },
    );
    mapUser(req, decoded);
    next();
  } catch {
    next(ERR.UNAUTHORIZED());
  }
};
