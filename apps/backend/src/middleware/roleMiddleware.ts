/**
 * @file roleMiddleware.ts
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import type { Request, Response, NextFunction } from 'express';
import { ERR } from '@app/sdk';
import type { UserPayload } from './authMiddleware';

/**
 * @public
 * @summary Verifies that the authenticated user has one of the required roles.
 * @remarks
 * Always runs AFTER {@link authMiddleware} in the chain — `req.user` is guaranteed
 * to be present here because `authMiddleware` calls `next(ERR.UNAUTHORIZED())`
 * instead of `next()` when no valid token is found.
 *
 * Errors:
 *   - `ERR.UNAUTHORIZED()` — req.user is absent (authMiddleware misconfiguration guard)
 *   - `ERR.FORBIDDEN()`    — user exists but their role is not in the required list
 *
 * @example
 * ```ts
 * // In api.ts adapters:
 * security: { auth: authMiddleware, role: roleMiddleware }
 *
 * // In a handler:
 * api.handler('GET /admin/users', { roles: ['admin'] })(async (input, ctx) => { ... })
 * ```
 */
export const roleMiddleware =
  (roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user as UserPayload | undefined;

    // Guard: authMiddleware should always run first — this is a safety net.
    if (!user) return next(ERR.UNAUTHORIZED());

    if (!roles.includes(user.role)) return next(ERR.FORBIDDEN());

    next();
  };
