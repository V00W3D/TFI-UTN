import type { Request, Response } from 'express';
import type { Contract } from '@shared/ContractFactory';
import { z } from 'zod';
import { errorCatcher } from './errorcatcher';

export const controller = <TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  contract: Contract<TInput, TOutput>,
  handler: (input: z.infer<TInput>, req: Request) => Promise<z.infer<TOutput> | undefined>,
) => {
  return async (req: Request, res: Response) => {
    try {
      const parsed = contract.I.parse(req.body);

      const data = await handler(parsed, req);

      return res.json({
        ok: true,
        message: 'OK',
        data,
      });
    } catch (error) {
      const formatted = errorCatcher(error, contract.I, req.body);

      return res.status(formatted.status).json({
        ok: false,
        message: formatted.message,
        ...(formatted.params && { params: formatted.params }),
        ...(formatted.forbidden_fields && { forbidden_fields: formatted.forbidden_fields }),
        data: undefined,
      });
    }
  };
};
