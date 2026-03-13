import type { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ErrorTools } from './ErrorTools';

import { authMiddleware } from '@middleware/authMiddleware';
import { roleMiddleware } from '@middleware/roleMiddleware';

/* ============================================================
CONTRACT TYPE
============================================================ */

type AccessLevel = 'public' | 'auth' | 'role' | 'internal';

type Contract = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  access: AccessLevel;
  I: z.ZodTypeAny;
  O: z.ZodTypeAny;
};

/* ============================================================
TYPE INFERENCE
============================================================ */

type InputOf<C extends Contract> = z.infer<C['I']>;

type Controller<C extends Contract> = (input: InputOf<C>, req: Request) => Promise<any>;

type Middleware = (req: Request, res: Response, next: NextFunction) => any;

/* ============================================================
ROUTER HOLDER
============================================================ */

let routerRef: Router | null = null;

export const initConductor = (router: Router) => {
  routerRef = router;
};

/* ============================================================
SECURITY
============================================================ */

function resolveSecurity(access: AccessLevel, roles?: string[]): Middleware[] {
  switch (access) {
    case 'public':
      return [];

    case 'auth':
      return [authMiddleware];

    case 'role':
      if (!roles || roles.length === 0) {
        throw new Error('Role endpoints require roles[]');
      }

      return [authMiddleware, roleMiddleware(roles)];

    case 'internal':
      return [authMiddleware, roleMiddleware(['admin'])];

    default:
      return [];
  }
}

/* ============================================================
RUN MIDDLEWARES
============================================================ */

async function runMiddlewares(middlewares: Middleware[], req: Request, res: Response) {
  for (const mw of middlewares) {
    await new Promise<void>((resolve, reject) => {
      mw(req, res, (err?: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

/* ============================================================
CONDUCTOR
============================================================ */

export function conductor<C extends Contract>(
  contract: C,
  controller: Controller<C>,
  roles?: string[],
) {
  if (!routerRef) {
    throw new Error('Conductor not initialized');
  }

  const method = contract.method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';

  const middlewares = resolveSecurity(contract.access, roles);

  routerRef[method](contract.path, async (req: Request, res: Response) => {
    try {
      await runMiddlewares(middlewares, req, res);

      const input = contract.I.parse(req.body) as InputOf<C>;

      const data = await controller(input, req);

      const response = {
        ok: true as const,
        data,
      };

      contract.O.parse(response);

      return res.json(response);
    } catch (error) {
      const publicError = ErrorTools.catch(error, contract.I, req.body);

      const response = {
        ok: false as const,
        ...publicError,
      };

      contract.O.parse(response);

      const status =
        typeof error === 'object' && error !== null && 'status' in error
          ? (error as any).status
          : 400;

      return res.status(status).json(response);
    }
  });
}
