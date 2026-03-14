import type { Router, Request, Response, NextFunction } from 'express';
import type { Contract, InferRequest } from '@shared/ContractFactory';
import { ErrorTools } from './ErrorTools';
import { authMiddleware } from '@middleware/authMiddleware';
import { roleMiddleware } from '@middleware/roleMiddleware';
//#region TYPES
/** Endpoint access levels */
type AccessLevel = 'public' | 'auth' | 'role' | 'internal';
/** Controller function for a contract */
type Controller<C extends Contract<any, any, any, any>> = (
  input: InferRequest<C>,
  req: Request,
) => Promise<any>;
/** Express middleware type */
type Middleware = (req: Request, res: Response, next: NextFunction) => any;
//#endregion
//#region ROUTER
let routerRef: Router | null = null;
/** Initialize conductor with Express router */
export const initConductor = (router: Router) => {
  routerRef = router;
};
//#endregion
//#region SECURITY
/** Resolves middlewares according to access level */
function resolveSecurity(access: AccessLevel, roles?: string[]): Middleware[] {
  switch (access) {
    case 'public':
      return [];
    case 'auth':
      return [authMiddleware];
    case 'role':
      if (!roles || roles.length === 0) throw new Error('Role endpoints require roles[]');
      return [authMiddleware, roleMiddleware(roles)];
    case 'internal':
      return [authMiddleware, roleMiddleware(['admin'])];
    default:
      return [];
  }
}
//#endregion
//#region RUN_MIDDLEWARES
/** Executes an array of middlewares sequentially */
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
//#endregion
//#region CONDUCTOR
/** Mounts a typed contract with validation and error handling */
export function conductor<C extends Contract<any, any, any, any>>(
  contract: C,
  controller: Controller<C>,
  roles?: string[],
) {
  if (!routerRef) throw new Error('Conductor not initialized');
  const method = contract.method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
  const middlewares = resolveSecurity(contract.access, roles);
  routerRef[method](contract.endpoint, async (req: Request, res: Response) => {
    try {
      await runMiddlewares(middlewares, req, res);
      const input = contract.I.parse(req.body) as InferRequest<C>;
      const data = await controller(input, req);
      const response = { ok: true as const, data };
      contract.O.parse(response);
      return res.json(response);
    } catch (error) {
      const publicError = ErrorTools.catch(error, contract.I, req.body);
      const response = { ok: false as const, ...publicError };
      contract.O.parse(response);
      const status =
        typeof error === 'object' && error !== null && 'status' in error
          ? (error as any).status
          : 400;
      return res.status(status).json(response);
    }
  });
}
//#endregion
