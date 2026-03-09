import { publicProcedure, protectedProcedure } from '../config/trpc/trpc';
import { errorFormatter } from '@utils/errorformatter';
import type { Contract } from '@contracts/ContractFactory';
import { z } from 'zod';

type Visibility = 'public' | 'private';

export const procedure = <TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  visibility: Visibility,
  contract: Contract<TInput, TOutput>,
) => {
  const base = visibility === 'public' ? publicProcedure : protectedProcedure;

  const builder = base.input(contract.I).output(z.union([contract.O, contract.E]));

  return {
    mutation: <TResolver extends Parameters<typeof builder.mutation>[0]>(resolver: TResolver) =>
      builder.mutation(async (opts) => {
        try {
          return await resolver(opts);
        } catch (err) {
          const formatted = errorFormatter(err);

          return {
            ok: false,
            message: formatted.message,
          };
        }
      }),

    query: <TResolver extends Parameters<typeof builder.query>[0]>(resolver: TResolver) =>
      builder.query(async (opts) => {
        try {
          return await resolver(opts);
        } catch (err) {
          const formatted = errorFormatter(err);

          return {
            ok: false,
            message: formatted.message,
          };
        }
      }),

    subscription: <TResolver extends Parameters<typeof builder.subscription>[0]>(
      resolver: TResolver,
    ) =>
      builder.subscription(async (opts) => {
        try {
          return await resolver(opts);
        } catch (err) {
          const formatted = errorFormatter(err);

          return {
            ok: false,
            message: formatted.message,
          };
        }
      }),
  };
};
