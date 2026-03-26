/**
 * @file AuthGuard.ts
 * @author Victor
 * @description NestJS Guard that verifies JWT cookies and manages token rotation natively, without Express payloads.
 * @remarks Evaluates authentication validity using CupCake/Cake tokens, throws native UnauthorizedException on failure.
 *
 * Metrics:
 * - LOC: 60
 * - Experience Level: Mid
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 2
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { BUN_MODE, SESSION_SECRET, REFRESH_SECRET } from '@env';

export type UserPayload = {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  role: 'CUSTOMER' | 'STAFF' | 'AUTHORITY';
};

const COOKIE_BASE = {
  httpOnly: true,
  secure: BUN_MODE === 'prod',
  sameSite: 'strict',
  maxAge: 1000 * 60 * 60, // 1h
} as const;

/**
 * Parses raw cookie header string into an object mappings.
 */
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((res: Record<string, string>, item) => {
    const parts = item.split('=');
    const name = parts[0]?.trim();
    if (name && parts[1]) {
      res[name] = decodeURIComponent(parts[1].trim());
    }
    return res;
  }, {});
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Parse raw cookies from headers without relying on express cookie-parser
    const cookies = parseCookies(request.headers.cookie);
    const accessToken = cookies.CupCake;
    const refreshToken = cookies.Cake;

    if (accessToken) {
      try {
        request.user = jwt.verify(accessToken, SESSION_SECRET) as UserPayload;
        return true;
      } catch {
        // Expired or tampered — fall through to refresh token
      }
    }

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as UserPayload;
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

        // Native fastify/express agnostic header append for cookie
        const secureStr = COOKIE_BASE.secure ? '; Secure' : '';
        const cookieStr = `CupCake=${encodeURIComponent(newAccess)}; Max-Age=3600; Path=/; HttpOnly${secureStr}; SameSite=Strict`;

        // Append cookie header (fallback arrays logic for cross-platform support)
        let setCookie = response.getHeader('Set-Cookie') || [];
        if (!Array.isArray(setCookie)) setCookie = [setCookie as string];
        response.setHeader('Set-Cookie', [...setCookie, cookieStr]);

        request.user = decoded;
        return true;
      } catch {
        // Expired or tampered — fall through to unauthorized
      }
    }

    throw new UnauthorizedException('Please authenticate to access this resource.');
  }
}
