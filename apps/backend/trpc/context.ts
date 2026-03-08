// trpc/context.ts
import type { Request, Response } from 'express';

export function createContext({ req, res }: { req: Request; res: Response }) {
  return {
    req,
    res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
