import { z } from 'zod';
import { publicProcedure, protectedProcedure } from './trpc';
import type { Contract } from '@contracts/ContractFactory';

type Visibility = 'public' | 'private';

export function procedure<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
  visibility: Visibility,
  contract: Contract<TInput, TOutput>,
) {
  const base = visibility === 'public' ? publicProcedure : protectedProcedure;

  return base.input(contract.I).output(z.union([contract.O, contract.E]));
}
