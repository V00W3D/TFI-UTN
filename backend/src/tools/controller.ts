import type { Request, Response } from 'express';
import type { Contract } from './ContractFactory';
import { z } from 'zod';
import { ErrorTools } from './ErrorTools';

/* ============================================================
   TYPE HELPERS
============================================================ */

type ExtractSuccess<T extends z.ZodTypeAny> =
  Extract<z.infer<T>, { ok: true }> extends { data: infer D } ? D : never;

/* ============================================================
   CONTROLLER
============================================================ */

export const controller = <TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  contract: Contract<TInput, TOutput>,
  handler: (input: z.infer<TInput>, req: Request) => Promise<ExtractSuccess<TOutput>>,
) => {
  return async (req: Request, res: Response) => {
    try {
      const parsedInput = contract.I.parse(req.body) as z.infer<TInput>;

      const data = await handler(parsedInput, req);

      const response = {
        ok: true as const,
        data,
      };

      contract.O.parse(response);

      return res.json(response);
    } catch (error) {
      const formatted = ErrorTools.catch(error, contract.I, req.body);

      const response = {
        ok: false as const,
        ...formatted,
      };

      contract.O.parse(response);

      return res.status(400).json(response);
    }
  };
};
