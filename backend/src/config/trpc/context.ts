import type { Request, Response } from 'express';
import { resolveUser } from './authmiddleware';

export async function createContext({ req, res }: { req: Request; res: Response }) {
  const user = await resolveUser(req, res);

  return {
    user,
  };
}

export type Context = {
  user: Awaited<ReturnType<typeof resolveUser>>;
};
