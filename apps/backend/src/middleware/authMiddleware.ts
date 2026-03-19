import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ERR } from '@app/sdk';
import { BUN_MODE, SESSION_SECRET, REFRESH_SECRET } from '@env';

//#region USER_PAYLOAD
/**
 * @public Shape of the JWT payload — attached to `req.user` by this middleware.
 * Contains only the stable user fields; sub-profile (tier/post/rank) is NOT
 * stored in the JWT and must be fetched fresh from the DB via GET /iam/me.
 */
export type UserPayload = {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  role: 'CUSTOMER' | 'STAFF' | 'AUTHORITY';
};
//#endregion

//#region EXPRESS AUGMENTATION
declare global {
  namespace Express {
    interface Request {
      /**
       * Attached by {@link authMiddleware} when a valid JWT is present.
       * `null` is never set — the field is simply absent on unauthenticated requests
       * because `exactOptionalPropertyTypes` disallows `undefined` on optional fields.
       */
      user?: UserPayload;
    }
  }
}
//#endregion

//#region COOKIE_CONFIG
const COOKIE_BASE = {
  httpOnly: true,
  secure: BUN_MODE === 'prod',
  sameSite: 'strict',
  maxAge: 1000 * 60 * 60, // 1h
} as const;
//#endregion

//#region AUTH_MIDDLEWARE
/**
 * @public
 * @summary Verifies the CupCake (access) or Cake (refresh) JWT cookie.
 * @remarks
 * This middleware is ONLY applied to routes with `access: 'auth'`, `'role'`, or `'internal'`
 * by `resolveSecurityChain` in ApiServer — public routes never see it.
 * Therefore: if no valid token is found, `next(ERR.UNAUTHORIZED())` is called
 * so the SDK's middleware chain propagates the error and returns HTTP 401.
 *
 * Token priority:
 *   1. CupCake (access token, 1h) — verified first
 *   2. Cake (refresh token, 7d) — used when access token is expired,
 *      rotates a new CupCake in the response
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies?.CupCake as string | undefined;
  const refreshToken = req.cookies?.Cake as string | undefined;

  // ── 1. Access token ───────────────────────────────────────
  if (accessToken) {
    try {
      req.user = jwt.verify(accessToken, SESSION_SECRET) as UserPayload;
      return next();
    } catch {
      // Expired or tampered — fall through to refresh token.
    }
  }

  // ── 2. Refresh token (rotate access token) ────────────────
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as UserPayload;

      // Issue a fresh access token with only the stable payload fields.
      const newAccess = jwt.sign(
        {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          phone: decoded.phone,
          role: decoded.role,
        },
        SESSION_SECRET,
        { expiresIn: '1h' },
      );

      res.cookie('CupCake', newAccess, COOKIE_BASE);

      req.user = decoded;
      return next();
    } catch {
      // Refresh token expired or tampered — fall through to unauthorized.
    }
  }

  // ── 3. No valid token ─────────────────────────────────────
  // next(error) causes the SDK's runMiddlewareChain to reject,
  // which is caught and converted to a 401 PublicErrorEnvelope.
  next(ERR.UNAUTHORIZED());
};
//#endregion
