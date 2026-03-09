import type { Request, Response } from 'express';
import { resolveUser } from '../tools/authmiddleware';

export async function createContext({ req, res }: { req: Request; res: Response }) {
  const user = await resolveUser(req, res);

  return {
    req,
    res,
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
