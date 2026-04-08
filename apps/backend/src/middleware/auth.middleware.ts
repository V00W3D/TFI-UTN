/**
 * @file auth.middleware.ts
 * @module Backend
 * @description Archivo auth.middleware alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 12.1
 * rf: RF-10
 * rnf: RNF-02
 *
 * @business
 * inputs: request, response, next y configuracion de seguridad
 * outputs: contexto HTTP enriquecido o corte temprano de la request
 * rules: validar autenticacion o autorizacion antes del handler
 *
 * @technical
 * dependencies: express, jsonwebtoken, env, @app/sdk
 * flow: inspecciona el request y sus credenciales o roles; valida la condicion de seguridad correspondiente; modifica el contexto o rechaza la request; delega al siguiente eslabon cuando pasa la validacion.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: la seguridad se implementa como middlewares composables reutilizables
 */
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
  name?: string;
  sname?: string | null;
  lname?: string;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  email?: string;
  emailVerified?: boolean;
  phone?: string | null;
  phoneVerified?: boolean;
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
    name: p.name ?? '',
    sname: p.sname ?? null,
    lname: p.lname ?? '',
    sex: p.sex ?? 'OTHER',
    email: p.email ?? '',
    emailVerified: p.emailVerified ?? false,
    phone: p.phone ?? null,
    phoneVerified: p.phoneVerified ?? false,
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
          name: decoded.name,
          sname: decoded.sname,
          lname: decoded.lname,
          sex: decoded.sex,
          email: decoded.email,
          emailVerified: decoded.emailVerified,
          phone: decoded.phone,
          phoneVerified: decoded.phoneVerified,
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
