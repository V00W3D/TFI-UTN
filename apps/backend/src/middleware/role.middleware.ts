import type { Request, Response, NextFunction } from 'express';
import { ERR } from '@app/sdk';

/**
 * @description Role-Based Access Control (RBAC) Middleware.
 * Guards routes by verifying if the authenticated subject (req.user) possesses one of the required roles.
 * Must be executed AFTER authMiddleware.
 */
export const roleMiddleware =
  (roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return next(ERR.FORBIDDEN());
    next();
  };
