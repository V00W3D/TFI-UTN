import type { Request, Response, NextFunction } from 'express';
import { ERR } from '@tools/ErrorTools';

export const roleMiddleware =
  (roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(ERR.INVALID_CREDENTIALS());
    }

    if (!roles.includes(user.role)) {
      return next(ERR.VALUE_INVALID(['role']));
    }

    next();
  };
